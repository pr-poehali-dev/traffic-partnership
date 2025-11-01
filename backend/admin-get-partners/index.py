import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all partners, approve/reject applications (admin only)
    Args: event with httpMethod GET/POST, body for POST (partner_id, password, action)
    Returns: List of partners (GET) or approval result (POST)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        admin_email = event.get('headers', {}).get('x-user-id', '')
        partner_id = body_data.get('partner_id')
        password = body_data.get('password', '')
        action = body_data.get('action', 'approve')
        
        if not admin_email or not partner_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Missing admin email or partner_id'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        cur.execute("SELECT is_admin FROM partners WHERE email = %s AND is_approved = TRUE", (admin_email,))
        admin_row = cur.fetchone()
        
        if not admin_row or not admin_row[0]:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Access denied: admin only'})
            }
        
        if action == 'approve':
            cur.execute(
                "UPDATE partners SET is_approved = TRUE, password_hash = %s WHERE id = %s",
                (password, partner_id)
            )
        elif action == 'reject':
            cur.execute("DELETE FROM partners WHERE id = %s", (partner_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'action': action})
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
    admin_id = params.get('admin_id')
    
    if not admin_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'admin_id is required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("SELECT is_admin FROM partners WHERE id = %s", (admin_id,))
    admin_check = cur.fetchone()
    
    if not admin_check or not admin_check[0]:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Access denied. Admin only.'})
        }
    
    cur.execute("""
        SELECT 
            p.id, p.name, p.email, p.phone, p.traffic_source, 
            p.experience, p.is_approved, p.created_at,
            COUNT(l.id) as leads_count,
            SUM(CASE WHEN l.status = 'approved' THEN l.commission_amount ELSE 0 END) as total_commission
        FROM partners p
        LEFT JOIN leads l ON p.id = l.partner_id
        WHERE p.is_admin = FALSE
        GROUP BY p.id
        ORDER BY p.created_at DESC
    """)
    
    rows = cur.fetchall()
    
    partners = []
    for row in rows:
        partners.append({
            'id': row[0],
            'name': row[1],
            'email': row[2],
            'phone': row[3],
            'traffic_source': row[4],
            'experience': row[5],
            'is_approved': row[6],
            'created_at': row[7].isoformat() if row[7] else None,
            'leads_count': row[8] or 0,
            'total_commission': float(row[9]) if row[9] else 0
        })
    
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
            'partners': partners
        })
    }