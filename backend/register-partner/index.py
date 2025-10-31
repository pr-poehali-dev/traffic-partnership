import json
import os
from typing import Dict, Any
import psycopg2
from pydantic import BaseModel, Field, EmailStr, ValidationError

class PartnerRegistration(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=50)
    traffic_source: str = Field(default='', max_length=255)
    experience: str = Field(default='', max_length=2000)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Register new partner application
    Args: event with httpMethod, body (POST with partner data)
    Returns: Success or error response
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
    
    partner = PartnerRegistration(**body_data)
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO partners (name, email, phone, traffic_source, experience) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (partner.name, partner.email, partner.phone, partner.traffic_source, partner.experience)
    )
    
    partner_id = cur.fetchone()[0]
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'partner_id': partner_id,
            'message': 'Регистрация успешна! Мы свяжемся с вами в ближайшее время.'
        })
    }
