import pandas as pd
import json
import os
import re

# Путь к Excel-файлу
xlsx_path = '../../../src/sources/Каталог тем и заданий  — Лист20.xlsx'

# Проверяем наличие файла
if not os.path.exists(xlsx_path):
    # Пробуем другой путь
    xlsx_path = '/Users/roman/Documents/projects/physics/src/sources/Каталог тем и заданий  — Лист20.xlsx'
    if not os.path.exists(xlsx_path):
        print(f'Файл не найден. Проверьте расположение Excel-файла.')
        exit(1)

# Читаем данные из Excel-файла
try:
    df = pd.read_excel(xlsx_path, engine='openpyxl')
    print('Данные успешно загружены из Excel')
    print(f'Количество строк: {len(df)}')
    print(f'Столбцы: {df.columns.tolist()}')
    
    # Выведем первые несколько строк для отладки
    print('Первые 5 строк:')
    print(df.head())
    
    # Если данные загружены успешно, преобразуем их в JSON
    
    # Создаем список уникальных блоков
    blocks = []
    block_ids = df['block_id'].unique()
    
    for block_id in sorted(block_ids):
        if pd.notna(block_id):  # Проверяем, что block_id не является NaN
            # Придумываем названия для блоков
            block_titles = {
                1: "Основы математики",
                2: "Кинематика",
                3: "Динамика",
                4: "Законы сохранения",
                5: "Молекулярная физика",
                6: "Термодинамика",
                7: "Электростатика",
                8: "Электрический ток",
                9: "Магнитное поле",
                10: "Оптика"
            }
            
            block_title = block_titles.get(block_id, f"Раздел {block_id}")
            
            blocks.append({
                "id": int(block_id),
                "title": block_title
            })
    
    # Создаем список тем
    topics = []
    all_tags = set()
    topic_tags = {}
    
    for _, row in df.iterrows():
        if pd.notna(row['topic_id']) and pd.notna(row['title']):
            topic_id = int(row['topic_id'])
            block_id = int(row['block_id']) if pd.notna(row['block_id']) else None
            
            topic = {
                "id": topic_id,
                "title": row['title'],
                "block_id": block_id
            }
            
            topics.append(topic)
            
            # Обрабатываем теги
            if pd.notna(row['tags']):
                tags = [tag.strip() for tag in str(row['tags']).split(',')]
                topic_tags[str(topic_id)] = tags
                all_tags.update(tags)
    
    # Сортируем темы по id
    topics = sorted(topics, key=lambda x: x['id'])
    
    # Сортируем блоки по id
    blocks = sorted(blocks, key=lambda x: x['id'])
    
    # Сохраняем блоки в blocks.json
    with open('../blocks.json', 'w', encoding='utf-8') as f:
        json.dump({"blocks": blocks}, f, ensure_ascii=False, indent=2)
        print("Файл blocks.json успешно создан")
    
    # Сохраняем темы в topics.json
    with open('../topics.json', 'w', encoding='utf-8') as f:
        json.dump({"topics": topics}, f, ensure_ascii=False, indent=2)
        print("Файл topics.json успешно создан")
    
    # Сохраняем теги в tags.json
    with open('../tags.json', 'w', encoding='utf-8') as f:
        json.dump({
            "topic_tags": topic_tags,
            "available_tags": sorted(list(all_tags))
        }, f, ensure_ascii=False, indent=2)
        print("Файл tags.json успешно создан")
    
except Exception as e:
    print(f'Ошибка при обработке данных: {e}')
    exit(1) 