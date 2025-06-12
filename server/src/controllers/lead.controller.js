import Lead from '../models/Lead.js';


// Create new lead
const createLead = async (req, res) => {
    try {
        const { name, email, phone, source, message, ...extraFields } = req.body;

        const lead = await Lead.create({
            ownerId: req.user.userId, // Assign to current user
            name,
            email,
            phone,
            source,
            message,
            extraFields: new Map(Object.entries(extraFields)) // Convert extra fields to Map
        });

        res.status(201).json({
            success: true,
            message: 'Lead created successfully',
            data: lead
        });
    } catch (error) {
        console.error('Create lead error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all leads for a client
const getClientLeads = async (req, res) => {
    try {
        // Get leads where ownerId matches the current user's ID
        const leads = await Lead.find({ ownerId: req.user.userId })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error('Get client leads error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update lead
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Dynamically build update object only with provided fields
        const allowedFields = ['name', 'email', 'phone', 'source', 'message', 'status'];
        allowedFields.forEach(field => {
            if (field in req.body) {
                updateData[field] = req.body[field];
            }
        });

        // Find lead and verify ownership
        const lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found or unauthorized'
            });
        }

        // Handle extra fields separately while preserving existing ones
        const existingExtraFields = Object.fromEntries(lead.extraFields || new Map());
        const newExtraFields = Object.keys(req.body)
            .filter(key => !allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        // Merge existing and new extra fields
        const mergedExtraFields = { ...existingExtraFields, ...newExtraFields };
        
        if (Object.keys(mergedExtraFields).length > 0) {
            updateData.extraFields = new Map(Object.entries(mergedExtraFields));
        }

        // Update only if there are changes
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }

        // Update the lead
        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Lead updated successfully',
            data: updatedLead
        });
    } catch (error) {
        console.error('Update lead error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid lead ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete lead
const deleteLead = async (req, res) => {
    try {
        // Lead is already validated and attached to request by middleware
        await req.lead.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export {
    createLead,
    getClientLeads,
    updateLead,
    deleteLead
};