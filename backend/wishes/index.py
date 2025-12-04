import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с желаниями: получение списка, создание и удаление
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('SELECT id, wish, country, telegram, category, EXTRACT(EPOCH FROM created_at)::bigint * 1000 as created_at FROM wishes ORDER BY created_at DESC')
            rows = cur.fetchall()
            wishes = []
            for row in rows:
                wishes.append({
                    'id': row[0],
                    'wish': row[1],
                    'country': row[2],
                    'telegram': row[3],
                    'category': row[4],
                    'timestamp': row[5]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'wishes': wishes}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            wish = body.get('wish', '').strip()
            country = body.get('country', '').strip()
            telegram = body.get('telegram', '').strip()
            category = body.get('category', '')
            
            if not wish or not country or not telegram:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'INSERT INTO wishes (wish, country, telegram, category) VALUES (%s, %s, %s, %s) RETURNING id, EXTRACT(EPOCH FROM created_at)::bigint * 1000',
                (wish, country, telegram, category)
            )
            result = cur.fetchone()
            wish_id = result[0]
            timestamp = result[1]
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': wish_id,
                    'wish': wish,
                    'country': country,
                    'telegram': telegram,
                    'category': category,
                    'timestamp': timestamp
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            wish_id = query_params.get('id')
            
            if not wish_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('DELETE FROM wishes WHERE id = %s', (wish_id,))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
