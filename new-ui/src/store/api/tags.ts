import { tagsApi } from "../../api/http";

export const updateTag = async (data : any) => tagsApi.renameTag(data.oldTag, data.tag);

export const removeTag = async (tag : any) => tagsApi.deleteTag(tag);

export const getTags = async () => tagsApi.getTags();
