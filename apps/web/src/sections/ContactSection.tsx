import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '../components';
import { useSectionAnimation } from '../hooks/useScrollAnimation';

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

export const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const headerAnimation = useSectionAnimation(0);
    const formAnimation = useSectionAnimation(1);
    const successAnimation = useSectionAnimation(0);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Por favor, insira um email válido';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Mensagem é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulação de envio - será substituído pela integração real
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Form submitted:', formData);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (isSubmitted) {
        return (
            <section className="contact-section">
                <div className="container">
                    <motion.div
                        ref={successAnimation.ref}
                        initial={successAnimation.initial}
                        animate={successAnimation.animate}
                    >
                        <Card className="contact-success">
                            <h2>Mensagem Enviada!</h2>
                            <p>
                                Obrigado pelo seu contato. Retornaremos em breve!
                            </p>
                            <Button onClick={() => setIsSubmitted(false)}>
                                Enviar Nova Mensagem
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="contact-section">
            <div className="container">
                <motion.div 
                    className="section-header"
                    ref={headerAnimation.ref}
                    initial={headerAnimation.initial}
                    animate={headerAnimation.animate}
                >
                    <h2>Entre em Contato</h2>
                    <p className="section-subtitle">
                        Pronto para transformar sua ideia em realidade? 
                        Vamos conversar sobre seu próximo projeto.
                    </p>
                </motion.div>

                <div className="contact-content">
                    <motion.div
                        ref={formAnimation.ref}
                        initial={formAnimation.initial}
                        animate={formAnimation.animate}
                    >
                        <Card className="contact-form-card">
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`form-input ${errors.name ? 'error' : ''}`}
                                        placeholder="Seu nome completo"
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Mensagem</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`form-textarea ${errors.message ? 'error' : ''}`}
                                        placeholder="Conte-nos sobre seu projeto..."
                                        rows={5}
                                    />
                                    {errors.message && <span className="error-message">{errors.message}</span>}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="form-submit"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;