import http from '../helpers/http';

export const updateTag = async (data : any) => http().put(`tags/${data.oldTag}`, { tag: data.newTag });

export const removeTag = async (tag : any) => http().delete(`tags/${tag}`);

export const getTags = async () => http().get('/tags');
