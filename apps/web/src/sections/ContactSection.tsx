"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "../components";
import { useSectionAnimation } from "../hooks/useScrollAnimation";
import { useSubmitContact } from "../hooks/useApi";
import { contactFormSchema, ContactFormData } from "../lib/schemas";
import { ApiError } from "../lib/api";

export const ContactSection: React.FC = () => {
    const headerAnimation = useSectionAnimation(0);
    const formAnimation = useSectionAnimation(1);
    const successAnimation = useSectionAnimation(0);

    // Configurar react-hook-form com validação Zod
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onChange",
    });

    // Hook para submissão do formulário
    const submitContactMutation = useSubmitContact({
        onSuccess: (data) => {
            console.log("Mensagem enviada com sucesso:", data);
            reset(); // Limpar formulário após sucesso
        },
        onError: (error: ApiError) => {
            console.error("Erro ao enviar mensagem:", error);

            // Definir erro no formulário para exibir feedback
            if (error.status === 400) {
                setError("root", {
                    message: error.data?.message || "Dados inválidos. Verifique os campos e tente novamente.",
                });
            } else {
                setError("root", {
                    message: error.message || "Erro interno do servidor. Tente novamente mais tarde.",
                });
            }
        },
    });

    // Handler para submissão do formulário
    const onSubmit = (data: ContactFormData) => {
        submitContactMutation.mutate(data);
    };

    // Estado de loading e sucesso
    const isSubmitting = submitContactMutation.isPending;
    const isSubmitted = submitContactMutation.isSuccess;

    // Função para resetar o estado de sucesso
    const resetSuccess = () => {
        submitContactMutation.reset();
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
                    ref={headerAnimation.ref}
                    initial={headerAnimation.initial}
                    animate={headerAnimation.animate}
                >
                    <h2>Entre em Contato</h2>
                    <p className="section-subtitle">
                        Pronto para transformar sua ideia em realidade? Vamos conversar sobre seu próximo projeto.
                    </p>
                </motion.div>

                <div className="contact-content">
                    <motion.div ref={formAnimation.ref} initial={formAnimation.initial} animate={formAnimation.animate}>
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

                                {/* Erro geral do formulário */}
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
