import api from './api.service.js'

export async function addTaskAdmin(task, answer, hint, topic_id, type) {
    const response = await api.post('/admin/add-task-admin', { task, answer, hint, topic_id, type })
    return response
}

export async function editTaskAdmin(task, answer, hint, type, id) {
    const response = await api.put('/admin/edit-task-admin', { task, answer, hint, type, id })
    return response
}

export async function deleteTaskAdmin(id, type) {
    const response = await api.delete('/admin/delete-task-admin', { data: { id, type } })
    return response
}

export async function addTagAdmin(title) {
    const response = await api.post('/admin/add-tag-admin', { title })
    return response
}

export async function editTagAdmin(id, title) {
    const response = await api.put('/admin/edit-tag-admin', { id, title })
    return response
}

export async function deleteTagAdmin(id) {
    const response = await api.delete('/admin/delete-tag-admin', { data: { id } })
    return response
}

export async function addTopicAdmin(title, block_id) {
    const response = await api.post('/admin/add-topic-admin', { title, block_id })
    return response
}

export async function editTopicAdmin(id, title) {
    const response = await api.put('/admin/edit-topic-admin', { id, title })
    return response
}

export async function deleteTopicAdmin(id) {
    const response = await api.delete('/admin/delete-topic-admin', { data: { id } })
    return response
}

export async function addBlockAdmin(title) {
    const response = await api.post('/admin/add-block-admin', { title })
    return response
}

export async function editBlockAdmin(id, title) {
    const response = await api.put('/admin/edit-block-admin', { id, title })
    return response
}

export async function deleteBlockAdmin(id) {
    const response = await api.delete('/admin/delete-block-admin', { data: { id } })
    return response
}

export async function connectTagWithTopic(tag_id, topic_id) {
    const response = await api.post('/admin/connect-topic-tag', { tag_id, topic_id })
    return response
}

export async function getUsers() {
    const response = await api.get('/admin/get-users')
    return response
}

export async function editUserRole(id, role) {
    const response = await api.put('/admin/edit-role', { id, role })
    return response
}
