#!/usr/bin/env node

/**
 * Rate Limiting Test Script
 * Testa o sistema de rate limiting do formulário de contato
 * Rate limit: 1 envio a cada 30 minutos por email
 */

const API_URL = "http://localhost:3000/api/contact";

const testData = {
    name: "João Teste",
    email: "joao.teste@example.com",
    subject: "Teste de Rate Limiting",
    message: "Esta é uma mensagem de teste para verificar o sistema de rate limiting.",
};

async function testRateLimit() {
    console.log("🧪 Iniciando teste de Rate Limiting...\n");

    try {
        // Primeiro envio - deve funcionar
        console.log("📤 Teste 1: Primeiro envio (deve funcionar)");
        const response1 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        const result1 = await response1.json();
        console.log(`Status: ${response1.status}`);
        console.log(`Response:`, result1);
        console.log(`✅ Primeiro envio: ${result1.success ? "SUCESSO" : "FALHOU"}\n`);

        // Aguardar 1 segundo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Segundo envio - deve ser bloqueado
        console.log("📤 Teste 2: Segundo envio imediato (deve ser bloqueado)");
        const response2 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        const result2 = await response2.json();
        console.log(`Status: ${response2.status}`);
        console.log(`Response:`, result2);
        console.log(`✅ Rate limiting: ${response2.status === 429 ? "FUNCIONANDO" : "FALHOU"}\n`);

        // Teste com email diferente - deve funcionar
        console.log("📤 Teste 3: Email diferente (deve funcionar)");
        const testDataDifferentEmail = {
            ...testData,
            email: "maria.teste@example.com",
        };

        const response3 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testDataDifferentEmail),
        });

        const result3 = await response3.json();
        console.log(`Status: ${response3.status}`);
        console.log(`Response:`, result3);
        console.log(`✅ Email diferente: ${result3.success ? "FUNCIONANDO" : "FALHOU"}\n`);

        console.log("🎯 Resumo dos testes:");
        console.log(`- Primeiro envio: ${result1.success ? "✅ PASSOU" : "❌ FALHOU"}`);
        console.log(`- Rate limiting: ${response2.status === 429 ? "✅ PASSOU" : "❌ FALHOU"}`);
        console.log(`- Email diferente: ${result3.success ? "✅ PASSOU" : "❌ FALHOU"}`);
    } catch (error) {
        console.error("❌ Erro durante o teste:", error);
    }
}

// Executar teste
testRateLimit();
