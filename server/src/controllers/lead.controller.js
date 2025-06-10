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

export {
    createLead,
    getClientLeads
};