import pandas as pd
import json
import os
import re

# Путь к Excel-файлу
xlsx_path = '../../../src/sources/exercises.xlsx'

# Проверяем наличие файла
if not os.path.exists(xlsx_path):
    # Пробуем другой путь
    xlsx_path = '/Users/roman/Documents/projects/physics/src/sources/exercises.xlsx'
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
    
    # Проверяем необходимые столбцы
    required_columns = ['topic_id', 'type_id', 'id', 'task', 'answer']
    for column in required_columns:
        if column not in df.columns:
            print(f'Ошибка: в таблице отсутствует столбец {column}')
            exit(1)
    
    # Инициализируем структуру для exercises.json
    exercises_data = {
        "study_exercises": [],     # type_id = 1
        "check_exercises": [],     # type_id = 2
        "repetition_exercises": [] # type_id = 3
    }
    
    # Обрабатываем каждую строку
    for _, row in df.iterrows():
        if pd.isna(row['topic_id']) or pd.isna(row['type_id']) or pd.isna(row['id']):
            continue
            
        # Создаем базовую структуру задания
        exercise = {
            "topic_id": int(row['topic_id']),
            "id": int(row['id']),
            "task": str(row['task']),
            "answer": str(row['answer'])
        }
        
        # Добавляем подсказку, если она есть
        if 'hint' in df.columns and not pd.isna(row['hint']):
            exercise["hint"] = str(row['hint'])
        
        # Распределяем задания по типам
        type_id = int(row['type_id'])
        if type_id == 1:
            exercises_data["study_exercises"].append(exercise)
        elif type_id == 2:
            exercises_data["check_exercises"].append(exercise)
        elif type_id == 3:
            exercises_data["repetition_exercises"].append(exercise)
    
    # Сортируем задания по topic_id и id
    for key in exercises_data:
        exercises_data[key] = sorted(exercises_data[key], key=lambda x: (x['topic_id'], x['id']))
    
    # Сохраняем результат в JSON
    with open('../exercises.json', 'w', encoding='utf-8') as f:
        json.dump(exercises_data, f, ensure_ascii=False, indent=2)
        print(f"Файл exercises.json успешно создан")
    
except Exception as e:
    print(f'Ошибка при обработке данных: {e}')
    exit(1) 