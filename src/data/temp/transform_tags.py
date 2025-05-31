import json

# Загружаем существующие данные
with open('../tags.json', 'r', encoding='utf-8') as f:
    tags_data = json.load(f)

with open('../topics.json', 'r', encoding='utf-8') as f:
    topics_data = json.load(f)

# Извлекаем уникальные теги и создаем новую структуру
old_available_tags = tags_data['available_tags']
old_topic_tags = tags_data['topic_tags']

# Создаем новый массив тегов с id и title
new_tags = []
for i, tag_name in enumerate(old_available_tags):
    new_tags.append({
        "id": i,
        "title": tag_name
    })

# Создаем словарь для быстрого поиска id тега по его названию
tag_name_to_id = {tag["title"]: tag["id"] for tag in new_tags}

# Обновляем темы, добавляя массив tag_ids
for topic in topics_data['topics']:
    topic_id = str(topic['id'])
    topic_tag_names = old_topic_tags.get(topic_id, [])
    
    # Преобразуем имена тегов в их id
    topic_tag_ids = [tag_name_to_id[tag_name] for tag_name in topic_tag_names]
    
    # Добавляем массив tag_ids к теме
    topic['tag_ids'] = topic_tag_ids

# Сохраняем обновленные данные
with open('../tags_new.json', 'w', encoding='utf-8') as f:
    json.dump({"tags": new_tags}, f, ensure_ascii=False, indent=2)
    print("Файл tags_new.json успешно создан")

with open('../topics_new.json', 'w', encoding='utf-8') as f:
    json.dump(topics_data, f, ensure_ascii=False, indent=2)
    print("Файл topics_new.json успешно создан") 