import React from "react";
import { Button, Card } from "./components";

export default function App() {
    return (
        <main style={{ minHeight: '100vh', padding: '32px' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h1 style={{ color: 'var(--color-accent-primary)' }}>Inovacode Portfolio</h1>
                <p>Componentes UI configurados seguindo o blueprint de design!</p>
                
                {/* Teste de Cards */}
                <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <Card 
                        title="Card com Título"
                        subtitle="Este é um subtitle"
                    >
                        <p>Este card demonstra o sistema de componentes com título, subtitle e conteúdo principal.</p>
                    </Card>
                    
                    <Card 
                        title="Card Clicável"
                        onClick={() => alert('Card clicado!')}
                    >
                        <p>Este card é clicável e demonstra os estados de interação.</p>
                    </Card>
                    
                    <Card hoverable={false}>
                        <h3>Card sem Hover</h3>
                        <p>Este card não tem efeito hover, demonstrando flexibilidade.</p>
                    </Card>
                </div>
                
                {/* Teste de Botões */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Button onClick={() => alert('Botão primário!')}>
                        Botão Primário
                    </Button>
                    
                    <Button variant="secondary" onClick={() => alert('Botão secundário!')}>
                        Botão Secundário
                    </Button>
                    
                    <Button size="sm">
                        Pequeno
                    </Button>
                    
                    <Button size="lg">
                        Grande
                    </Button>
                    
                    <Button disabled>
                        Desabilitado
                    </Button>
                </div>
                
                {/* Demonstração da hierarquia tipográfica */}
                <Card title="Hierarquia Tipográfica">
                    <h1>Heading 1 - 56px Bold</h1>
                    <h2>Heading 2 - 40px Bold</h2>
                    <h3>Heading 3 - 24px SemiBold</h3>
                    <p>Texto body padrão - 18px Regular com line-height 1.6</p>
                    <small>Microcopy - 16px Regular</small>
                </Card>
            </div>
        </main>
    );
}
