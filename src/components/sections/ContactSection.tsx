"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../Button";
import { Card } from "../Card";
import { contactFormSchema, ContactFormData } from "../../types";
import { apiClient, ApiError } from "../../lib/api";

export const ContactSection: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onBlur", // Mudado de "onChange" para "onBlur" para não perder foco
    });

    const submitContactMutation = useMutation({
        mutationFn: (data: ContactFormData) => apiClient.submitContact(data),
        onSuccess: (data) => {
            console.log("Mensagem enviada com sucesso:", data);
            reset();
        },
        onError: (error: ApiError) => {
            console.error("Erro ao enviar mensagem:", error);

            // Limpar erros anteriores
            if (errors.root) {
                setError("root", { message: "" });
            }

            if (error.status === 400) {
                setError("root", {
                    message: error.data?.message || "Dados inválidos. Verifique os campos e tente novamente.",
                });
            } else if (error.status === 408) {
                setError("root", {
                    message: "A requisição demorou muito para responder. Tente novamente.",
                });
            } else if (error.status === 503) {
                setError("root", {
                    message: "Serviço temporariamente indisponível. Tente novamente mais tarde.",
                });
            } else if (error.status === 0) {
                setError("root", {
                    message: "Erro de conexão. Verifique sua internet e tente novamente.",
                });
            } else {
                setError("root", {
                    message: error.message || "Erro interno do servidor. Tente novamente mais tarde.",
                });
            }
        },
    });

    const onSubmit = (data: ContactFormData) => {
        console.log("Submitting contact form...", data);
        submitContactMutation.mutate(data);
    };

    const isSubmitting = submitContactMutation.isPending;
    const isSubmitted = submitContactMutation.isSuccess;

    const resetSuccess = () => {
        submitContactMutation.reset();
    };

    if (isSubmitted) {
        return (
            <section className="contact-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="contact-success">
                            <h2>Mensagem Enviada!</h2>
                            <p>Obrigado pelo seu contato. Retornaremos em breve!</p>
                            <Button onClick={resetSuccess}>Enviar Nova Mensagem</Button>
                        </Card>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="contact-section" aria-label="Formulário de contato">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2>Entre em Contato</h2>
                    <p className="section-subtitle">
                        Pronto para transformar sua ideia em realidade? Vamos conversar sobre seu próximo projeto.
                    </p>
                </motion.div>

                <div className="contact-content">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Card className="contact-form-card">
                            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register("name")}
                                        className={`form-input ${errors.name ? "error" : ""}`}
                                        placeholder="Seu nome completo"
                                    />
                                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        className={`form-input ${errors.email ? "error" : ""}`}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">
                                        Assunto
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        {...register("subject")}
                                        className={`form-input ${errors.subject ? "error" : ""}`}
                                        placeholder="Assunto da mensagem"
                                    />
                                    {errors.subject && <span className="error-message">{errors.subject.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="message"
                                        {...register("message")}
                                        className={`form-textarea ${errors.message ? "error" : ""}`}
                                        placeholder="Conte-nos sobre seu projeto..."
                                        rows={5}
                                    />
                                    {errors.message && <span className="error-message">{errors.message.message}</span>}
                                </div>

                                {errors.root && <div className="error-message text-center">{errors.root.message}</div>}

                                <Button type="submit" disabled={isSubmitting} className="form-submit">
                                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
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
