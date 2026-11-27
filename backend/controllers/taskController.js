
const Task = require("../models/Task");

// ==================================
// Create Task
// ==================================
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // 1. Validate title
        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        // 2. Validate title length
        if (title.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 100 characters"
            });
        }

        // 3. Validate description
        if (
            description !== undefined &&
            (typeof description !== "string" ||
             description.length > 1000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Description cannot exceed 1000 characters"
            });
        }

        // 4. Validate status
        const allowedStatus = [
            "todo",
            "in-progress",
            "completed"
        ];

        if (
            status !== undefined &&
            !allowedStatus.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        // 5. Validate priority
        const allowedPriority = [
            "low",
            "medium",
            "high"
        ];

        if (
            priority !== undefined &&
            !allowedPriority.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task priority"
            });
        }

        // 6. Validate due date
        let parsedDueDate = null;

        if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
            if (
                typeof dueDate !== "string" ||
                !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dueDate) ||
                Number.isNaN(Date.parse(dueDate))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid due date"
                });
            }

            parsedDueDate = new Date(dueDate);
        }

        // 7. Create task
        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            status,
            priority,
            dueDate: parsedDueDate,
            user: req.user.id
        });

        // 8. Return response
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// Get all tasks of logged-in user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            task
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    createTask,
    getTasks,
    getTaskById
};
