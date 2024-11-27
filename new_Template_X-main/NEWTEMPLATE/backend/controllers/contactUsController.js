import Contact from "../models/contactUsModel.js";
import nodemailer from "nodemailer";


// Controller for creating a new contact us submission
export const createContactController = async (req, res) => {
    try {
        const { name, email, queryType, message } = req.body;
        const newContact = new Contact({ name, email, queryType, message });
        await newContact.save();

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_Host,
            port: process.env.SMTP_Port,
            secure: true,
            auth: {
                user: process.env.Email_User,
                pass: process.env.Email_Password
            }
        });

        const mailOptions = {
            from: `"GreenLine Technology" <${process.env.Email_User}>`,
            to: email,
            subject: "Thank you for contacting us",
            text: "We have received your inquiry and will respond to you as soon as possible.",
            html: "<b>We have received your inquiry and will respond to you as soon as possible.</b>"
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for retrieving all contact us submissions
export const getContactsController = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for retrieving a specific contact us submission by ID
export const getContactController = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for updating a specific contact us submission by ID


// Controller for deleting a specific contact us submission by ID
export const deleteContactController = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// controllers/contactUsController.js

export const generateReport = async (req, res) => {
    try {
        const report = await Contact.aggregate([
            {
                $group: {
                    _id: "$queryType",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


