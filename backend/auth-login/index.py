import json
import os
from typing import Dict, Any
import psycopg2
import hashlib
import secrets
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

def hash_password(password: str, salt: str = None) -> tuple:
    if salt is None:
        salt = secrets.token_hex(16)
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    password_hash = salt + '$' + hash_obj.hex()
    return password_hash, salt

def verify_password(password: str, password_hash: str) -> bool:
    if not password_hash or '$' not in password_hash:
        return False
    salt = password_hash.split('$')[0]
    test_hash, _ = hash_password(password, salt)
    return test_hash == password_hash

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Partner authentication - login
    Args: event with httpMethod POST, body with email and password
    Returns: Partner data with session token
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    login_data = LoginRequest(**body_data)
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, name, email, password_hash, is_admin, is_approved FROM partners WHERE email = %s",
        (login_data.email,)
    )
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    if not result:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }
    
    partner_id, name, email, password_hash, is_admin, is_approved = result
    
    if not password_hash:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Аккаунт не активирован. Ожидайте письмо с паролем.'})
        }
    
    if not verify_password(login_data.password, password_hash):
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }
    
    if not is_approved:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Ваша заявка на рассмотрении. Ожидайте одобрения.'})
        }
    
    session_token = secrets.token_urlsafe(32)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'partner': {
                'id': partner_id,
                'name': name,
                'email': email,
                'is_admin': is_admin
            },
            'session_token': session_token
        })
    }
