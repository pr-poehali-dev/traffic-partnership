'''
Business: Вход администратора в систему с проверкой email и пароля
Args: event - dict с httpMethod, body (email, password)
      context - объект с request_id
Returns: HTTP response с токеном или ошибкой
'''

import json
import os
from typing import Dict, Any
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip()
    password = body_data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Email и пароль обязательны'})
        }
    
    # Подключение к БД
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Поиск администратора
    cursor.execute(
        "SELECT id, email, password_hash, name FROM t_p62408730_traffic_partnership.admins WHERE email = %s",
        (email,)
    )
    admin = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not admin:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }
    
    # Проверка пароля
    password_bytes = password.encode('utf-8')
    hash_bytes = admin['password_hash'].encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hash_bytes):
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }
    
    # Успешный вход
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'admin': {
                'id': admin['id'],
                'email': admin['email'],
                'name': admin['name']
            }
        })
    }
