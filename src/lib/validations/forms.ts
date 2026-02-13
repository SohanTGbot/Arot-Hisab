import { z } from "zod";

// Transaction Schema
export const transactionSchema = z.object({
    buyerName: z.string().min(1, "Buyer name is required"),
    sellerName: z.string().min(1, "Seller name is required"),
    grossWeight: z.number().positive("Gross weight must be positive"),
    ratePerKg: z.number().positive("Rate per kg must be positive"),
    deductionPercentage: z.number().min(0).max(100).default(5),
    commissionPercentage: z.number().min(0).max(100).default(2),
    calculationMethod: z.enum(["A", "B"]).default("B"),
    notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// Saved Contact Schema (for address book)
export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    type: z.enum(["buyer", "seller"]),
    notes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Contact Message Schema (for Contact Us page)
export const contactMessageSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactMessageFormData = z.infer<typeof contactMessageSchema>;

// Feedback Schema
export const feedbackSchema = z.object({
    type: z.enum(["bug", "feature", "general"]),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

// Profile Schema
export const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    preferredLanguage: z.enum(["en", "bn"]).default("en"),
    preferredDeductionMethod: z.enum(["A", "B"]).default("A"),
    theme: z.enum(["light", "dark", "system"]).default("system"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
