import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create new lead for authenticated partner
    Args: event with httpMethod, body (name, phone, email, education_level, notes)
          context with request_id
    Returns: HTTP response with created lead
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_str = event.get('body', '{}')
    body_data = json.loads(body_str) if body_str else {}
    headers = event.get('headers', {})
    partner_email = headers.get('x-user-id') or headers.get('X-User-Id', '')
    
    if not partner_email:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Authentication required'})
        }
    
    name = body_data.get('name', '')
    phone = body_data.get('phone', '')
    email = body_data.get('email', '')
    education_level = body_data.get('education_level', '')
    notes = body_data.get('notes', '')
    
    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Missing required fields: name, phone'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id FROM partners WHERE email = %s AND is_approved = TRUE",
        (partner_email,)
    )
    partner_row = cur.fetchone()
    
    if not partner_row:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Partner not found or not approved'})
        }
    
    partner_id = partner_row[0]
    
    cur.execute(
        """
        INSERT INTO leads (partner_id, name, phone, email, education_level, notes, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'new')
        RETURNING id, created_at
        """,
        (partner_id, name, phone, email, education_level, notes)
    )
    
    lead_row = cur.fetchone()
    lead_id = lead_row[0]
    created_at = lead_row[1].isoformat()
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'lead': {
                'id': lead_id,
                'name': name,
                'phone': phone,
                'email': email,
                'education_level': education_level,
                'notes': notes,
                'status': 'new',
                'created_at': created_at
            }
        })
    }