import Joi from "joi";

export const taskIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Invalid task ID format",
    "any.required": "Task ID is required",
  }),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
    "string.max": "Title cannot exceed 150 characters",
  }),
  description: Joi.string().trim().max(1000).optional().allow("", null).messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),
  completed: Joi.boolean().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(150).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 150 characters",
  }),
  description: Joi.string().trim().max(1000).optional().allow("", null).messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),
  completed: Joi.boolean().optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

export const listTasksSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(100).optional().allow(""),
  completed: Joi.boolean().optional(),
});
