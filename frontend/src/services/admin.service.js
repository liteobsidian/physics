import api from './api.service.js'

export async function addTaskAdmin(task, answer, hint, topic_id, type) {
    const response = await api.post('/admin/add-task-admin', { task, answer, hint, topic_id, type })
    return response
}

export async function editTaskAdmin(task, answer, hint, type, id) {
    const response = await api.put('/admin/edit-task-admin', { task, answer, hint, type, id })
    return response
}

export async function deleteTaskAdmin(id, type){
    const response = await api.delete('/admin/delete-task-admin', {data: {id, type}})
    return response
}