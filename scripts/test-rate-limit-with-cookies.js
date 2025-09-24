#!/usr/bin/env node

/**
 * Rate Limiting Test Script with Cookie Simulation
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

// Simular armazenamento de cookies
let cookies = "";

async function testRateLimitWithCookies() {
    console.log("🧪 Iniciando teste de Rate Limiting com simulação de cookies...\n");

    try {
        // Primeiro envio - deve funcionar
        console.log("📤 Teste 1: Primeiro envio (deve funcionar)");
        const response1 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookies && { Cookie: cookies }),
            },
            body: JSON.stringify(testData),
        });

        // Capturar cookies da resposta
        const setCookieHeader = response1.headers.get("set-cookie");
        if (setCookieHeader) {
            cookies = setCookieHeader.split(";")[0]; // Pegar apenas o nome=valor
            console.log("🍪 Cookie recebido:", cookies);
        }

        const result1 = await response1.json();
        console.log(`Status: ${response1.status}`);
        console.log(`Response:`, result1);
        console.log(`✅ Primeiro envio: ${result1.success ? "SUCESSO" : "FALHOU"}\n`);

        // Aguardar 1 segundo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Segundo envio - deve ser bloqueado (usando cookies)
        console.log("📤 Teste 2: Segundo envio imediato com cookies (deve ser bloqueado)");
        const response2 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookies && { Cookie: cookies }),
            },
            body: JSON.stringify(testData),
        });

        const result2 = await response2.json();
        console.log(`Status: ${response2.status}`);
        console.log(`Response:`, result2);
        console.log(`✅ Rate limiting: ${response2.status === 429 ? "FUNCIONANDO" : "FALHOU"}\n`);

        // Teste com email diferente mas mesmo cookie - deve funcionar
        console.log("📤 Teste 3: Email diferente com mesmo cookie (deve funcionar)");
        const testDataDifferentEmail = {
            ...testData,
            email: "maria.teste@example.com",
        };

        const response3 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookies && { Cookie: cookies }),
            },
            body: JSON.stringify(testDataDifferentEmail),
        });

        const result3 = await response3.json();
        console.log(`Status: ${response3.status}`);
        console.log(`Response:`, result3);
        console.log(`✅ Email diferente: ${result3.success ? "FUNCIONANDO" : "FALHOU"}\n`);

        // Teste sem cookies (nova sessão) - deve funcionar
        console.log("📤 Teste 4: Mesmo email sem cookies (nova sessão - deve funcionar)");
        const response4 = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Sem cookies
            },
            body: JSON.stringify(testData),
        });

        const result4 = await response4.json();
        console.log(`Status: ${response4.status}`);
        console.log(`Response:`, result4);
        console.log(`✅ Nova sessão: ${result4.success ? "FUNCIONANDO" : "FALHOU"}\n`);

        console.log("🎯 Resumo dos testes:");
        console.log(`- Primeiro envio: ${result1.success ? "✅ PASSOU" : "❌ FALHOU"}`);
        console.log(`- Rate limiting: ${response2.status === 429 ? "✅ PASSOU" : "❌ FALHOU"}`);
        console.log(`- Email diferente: ${result3.success ? "✅ PASSOU" : "❌ FALHOU"}`);
        console.log(`- Nova sessão: ${result4.success ? "✅ PASSOU" : "❌ FALHOU"}`);
    } catch (error) {
        console.error("❌ Erro durante o teste:", error);
    }
}

// Executar teste
testRateLimitWithCookies();
