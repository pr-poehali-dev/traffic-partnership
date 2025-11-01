'''
Business: Управление партнёрами и лидами - одобрение, отклонение, изменение статусов
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с request_id
Returns: HTTP response с данными или результатом операции
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Подключение к БД
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # GET - получить всех партнёров и лиды
    if method == 'GET':
        action = event.get('queryStringParameters', {}).get('action', 'partners')
        
        if action == 'partners':
            cursor.execute("""
                SELECT id, name, email, phone, traffic_source, experience, 
                       created_at, is_approved
                FROM t_p62408730_traffic_partnership.partners
                ORDER BY created_at DESC
            """)
            partners = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'partners': [dict(p) for p in partners]}, default=str)
            }
        
        elif action == 'leads':
            cursor.execute("""
                SELECT l.*, p.name as partner_name, p.email as partner_email
                FROM t_p62408730_traffic_partnership.leads l
                JOIN t_p62408730_traffic_partnership.partners p ON l.partner_id = p.id
                ORDER BY l.created_at DESC
            """)
            leads = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'leads': [dict(l) for l in leads]}, default=str)
            }
    
    # POST - одобрить партнёра
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'approve':
            partner_id = body_data.get('partner_id')
            password = body_data.get('password', '')
            
            if not partner_id or not password or len(password) < 6:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID партнёра и пароль (минимум 6 символов) обязательны'})
                }
            
            # Хешируем пароль
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Обновляем партнёра
            cursor.execute("""
                UPDATE t_p62408730_traffic_partnership.partners
                SET is_approved = true, password_hash = %s
                WHERE id = %s
                RETURNING id, name, email
            """, (password_hash, partner_id))
            
            partner = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if not partner:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Партнёр не найден'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'partner': dict(partner),
                    'password': password
                })
            }
        
        elif action == 'reject':
            partner_id = body_data.get('partner_id')
            
            cursor.execute("""
                DELETE FROM t_p62408730_traffic_partnership.partners
                WHERE id = %s
                RETURNING id
            """, (partner_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Партнёр не найден'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    # PUT - изменить статус лида
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        lead_id = body_data.get('lead_id')
        status = body_data.get('status')
        commission = body_data.get('commission_amount')
        
        if not lead_id or not status:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'ID лида и статус обязательны'})
            }
        
        cursor.execute("""
            UPDATE t_p62408730_traffic_partnership.leads
            SET status = %s, commission_amount = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """, (status, commission, lead_id))
        
        lead = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if not lead:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Лид не найден'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'lead': dict(lead)}, default=str)
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
