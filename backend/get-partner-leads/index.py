import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all leads for a partner
    Args: event with httpMethod GET, queryStringParameters with partner_id
    Returns: List of leads with statistics
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Partner-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    partner_id = params.get('partner_id')
    
    if not partner_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'partner_id is required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            id, client_name, client_phone, client_email, 
            project_address, estimate_amount, status, 
            commission_amount, notes, created_at, updated_at
        FROM leads 
        WHERE partner_id = %s 
        ORDER BY created_at DESC
    """, (partner_id,))
    
    rows = cur.fetchall()
    
    leads = []
    for row in rows:
        leads.append({
            'id': row[0],
            'client_name': row[1],
            'client_phone': row[2],
            'client_email': row[3],
            'project_address': row[4],
            'estimate_amount': float(row[5]) if row[5] else 0,
            'status': row[6],
            'commission_amount': float(row[7]) if row[7] else 0,
            'notes': row[8],
            'created_at': row[9].isoformat() if row[9] else None,
            'updated_at': row[10].isoformat() if row[10] else None
        })
    
    cur.execute("""
        SELECT 
            COUNT(*) as total_leads,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_leads,
            SUM(CASE WHEN status = 'approved' THEN commission_amount ELSE 0 END) as total_commission
        FROM leads 
        WHERE partner_id = %s
    """, (partner_id,))
    
    stats_row = cur.fetchone()
    stats = {
        'total_leads': stats_row[0] or 0,
        'approved_leads': stats_row[1] or 0,
        'total_commission': float(stats_row[2]) if stats_row[2] else 0
    }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'leads': leads,
            'statistics': stats
        })
    }
