
"use strict";

// Modül 01: Basit mesnetli kiriş - düzgün yayılı yük
function calculateBeamReactions(length, load) {

    // Giriş değerlerini kontrol et
    if (!Number.isFinite(length) || length <= 0) {
        throw new Error("Kiriş uzunluğu pozitif olmalıdır.");
    }

    if (!Number.isFinite(load) || load < 0) {
        throw new Error("Yayılı yük negatif olamaz.");
    }

    // Toplam düşey yük (kN)
    const totalLoad = load * length;

    // Mesnet reaksiyonları (kN)
    const reactionA = totalLoad / 2;
    const reactionB = totalLoad / 2;

    // Hesap sonuçlarını döndür
    return {
        totalLoad,
        reactionA,
        reactionB
    };
}

// İlk doğrulama testi
const result = calculateBeamReactions(6, 10);

console.log("Toplam yük:", result.totalLoad, "kN");
console.log("A reaksiyonu:", result.reactionA, "kN");
console.log("B reaksiyonu:", result.reactionB, "kN");


 // Modül 01: Kesme kuvveti hesabı
function calculateShearForce(length, load, x) {

    // Konum kontrolü
    if (!Number.isFinite(x) || x < 0 || x > length) {
        throw new Error("Konum kiriş açıklığı içinde olmalıdır.");
    }

    // Mevcut reaksiyon fonksiyonunu kullan
    const reactions = calculateBeamReactions(length, load);

    // Kesme kuvveti (kN)
    const shearForce = reactions.reactionA - load * x;

    return shearForce;
}

// Kesme kuvveti testleri
console.log("V(0) =", calculateShearForce(6, 10, 0), "kN");
console.log("V(1.5) =", calculateShearForce(6, 10, 1.5), "kN");
console.log("V(3) =", calculateShearForce(6, 10, 3), "kN");
console.log("V(4.5) =", calculateShearForce(6, 10, 4.5), "kN");
console.log("V(6) =", calculateShearForce(6, 10, 6), "kN");


 // Modül 01: Eğilme momenti hesabı
function calculateBendingMoment(length, load, x) {

    // Konum kontrolü
    if (!Number.isFinite(x) || x < 0 || x > length) {
        throw new Error("Konum kiriş açıklığı içinde olmalıdır.");
    }

    // Mevcut reaksiyon fonksiyonunu kullan
    const reactions = calculateBeamReactions(length, load);

    // Eğilme momenti (kN.m)
    const bendingMoment =
        reactions.reactionA * x - (load * x * x) / 2;

    return bendingMoment;
}

// Maksimum moment hesabı
function calculateMaximumMoment(length, load) {

    const position = length / 2;
    const moment = calculateBendingMoment(length, load, position);

    return {
        position,
        moment
    };
}

// Eğilme momenti testleri
console.log("M(0) =", calculateBendingMoment(6, 10, 0), "kN.m");
console.log("M(1.5) =", calculateBendingMoment(6, 10, 1.5), "kN.m");
console.log("M(3) =", calculateBendingMoment(6, 10, 3), "kN.m");
console.log("M(4.5) =", calculateBendingMoment(6, 10, 4.5), "kN.m");
console.log("M(6) =", calculateBendingMoment(6, 10, 6), "kN.m");

const maximumMoment = calculateMaximumMoment(6, 10);

console.log("Mmax =", maximumMoment.moment, "kN.m");
console.log("Mmax konumu =", maximumMoment.position, "m");

 // Modül 01: Sehim hesabı
function calculateDeflection(length, load, E, I, x) {

    // Giriş değerlerini kontrol et
    if (!Number.isFinite(E) || E <= 0 ||
        !Number.isFinite(I) || I <= 0) {
        throw new Error("E ve I pozitif olmalıdır.");
    }

    if (!Number.isFinite(x) || x < 0 || x > length) {
        throw new Error("Konum kiriş açıklığı içinde olmalıdır.");
    }

    // Diğer fonksiyonun giriş kontrollerini kullan
    calculateBeamReactions(length, load);

    // Sehim (metre)
    const deflection =
        (load * x *
        (Math.pow(length, 3) -
         2 * length * x * x +
         Math.pow(x, 3))) /
        (24 * E * I);

    return deflection;
}

// Maksimum sehim hesabı
function calculateMaximumDeflection(length, load, E, I) {

    const position = length / 2;

    // Metre cinsinden sonucu milimetreye çevir
    const deflectionMM =
        calculateDeflection(length, load, E, I, position) * 1000;

    return {
        position,
        deflectionMM
    };
}

// Test
const E = 30000000; // kN/m²
const I = 0.01;     // m⁴

const maximumDeflection =
    calculateMaximumDeflection(6, 10, E, I);

console.log(
    "Maksimum sehim =",
    maximumDeflection.deflectionMM,
    "mm"
);

console.log(
    "Maksimum sehim konumu =",
    maximumDeflection.position,
    "m"
);

 // Modül 01: Birleşik hesap fonksiyonu
function analyzeUniformlyLoadedBeam(length, load, E, I) {

    // Giriş değerlerini ve reaksiyonları kontrol et
    const reactions = calculateBeamReactions(length, load);

    if (!Number.isFinite(E) || E <= 0 ||
        !Number.isFinite(I) || I <= 0) {
        throw new Error("E ve I pozitif olmalıdır.");
    }

    // Kritik konum: açıklığın ortası
    const midspan = length / 2;

    // Bütün hesap sonuçlarını birleştir
    return {
        inputs: {
            length,
            load,
            E,
            I
        },

        reactions: {
            A: reactions.reactionA,
            B: reactions.reactionB
        },

        maximumShear: load * length / 2,

        maximumMoment: {
            value: calculateBendingMoment(length, load, midspan),
            position: midspan
        },

        maximumDeflection: {
            valueMM:
                calculateDeflection(length, load, E, I, midspan) * 1000,
            position: midspan
        }
    };
}

// Birleşik hesap testi
const beamAnalysis = analyzeUniformlyLoadedBeam(
    6,
    10,
    30000000,
    0.01
);

console.log("BİRLEŞİK KİRİŞ ANALİZİ:", beamAnalysis);

const calculateButton = document.getElementById("calculate-button");

if (calculateButton) {
    calculateButton.addEventListener("click", function () {

        const L = Number(document.getElementById("beam-length").value);
        const w = Number(document.getElementById("beam-load").value);
        const E = Number(document.getElementById("beam-e").value);
        const I = Number(document.getElementById("beam-i").value);

        const resultElement = document.getElementById("result-status");

        if (!Number.isFinite(L) || L <= 0 ||
            !Number.isFinite(w) ||
            !Number.isFinite(E) || E <= 0 ||
            !Number.isFinite(I) || I <= 0) {

            resultElement.textContent =
                "Invalid input. Check length, load, E and I.";
            return;
        }

        const result = analyzeUniformlyLoadedBeam(L, w, E, I);
        drawShearDiagram(L, w);
        drawMomentDiagram(L, w);


        
        const lengthLabel = document.getElementById("svg-length-label");
        const loadLabel = document.getElementById("svg-load-label");

        if (lengthLabel && loadLabel) {
            lengthLabel.textContent = `L = ${L} m`;
            loadLabel.textContent = `w = ${w} kN/m`;
        }



        const RA = result.reactions.A;
        const RB = result.reactions.B;
        const Mmax = result.maximumMoment.value;
        const deltaMaxMM = result.maximumDeflection.valueMM;

        resultElement.innerHTML = `
            <strong>Support Reactions</strong>
            <p>RA = ${RA.toFixed(3)} kN</p>
            <p>RB = ${RB.toFixed(3)} kN</p>

            <strong>Maximum Bending Moment</strong>
            <p>Mmax = ${Mmax.toFixed(3)} kN·m</p>

            <strong>Maximum Deflection</strong>
            <p>δmax = ${deltaMaxMM.toFixed(4)} mm</p>
        `;
    });
}

function drawShearDiagram(length, load) {
    const svg = document.getElementById("shear-svg");

    if (!svg) return;

    const startX = 100;
    const endX = 700;
    const centerY = 130;
    const scaleY = 85;

    const shearA = calculateShearForce(length, load, 0);
    const shearB = calculateShearForce(length, load, length);

    const maxAbsShear = Math.max(
        Math.abs(shearA),
        Math.abs(shearB)
    );

    const yA = centerY -
        (maxAbsShear > 0 ? shearA / maxAbsShear * scaleY : 0);

    const yB = centerY -
        (maxAbsShear > 0 ? shearB / maxAbsShear * scaleY : 0);

    const polygonPoints =
        `${startX},${centerY} ` +
        `${startX},${yA} ` +
        `${endX},${yB} ` +
        `${endX},${centerY}`;

    svg.innerHTML = `
        <line x1="${startX}" y1="${centerY}"
              x2="${endX}" y2="${centerY}"
              stroke="currentColor" stroke-width="1"/>

        <polygon points="${polygonPoints}"
                 fill="#3c9b8f" fill-opacity="0.15"/>

        <line x1="${startX}" y1="${yA}"
              x2="${endX}" y2="${yB}"
              stroke="#3c9b8f" stroke-width="3"/>

        <text x="${startX}" y="${yA - 12}"
              fill="currentColor" font-size="18">
            ${shearA.toFixed(2)} kN
        </text>

        <text x="${endX}" y="${yB + 25}"
              fill="currentColor" font-size="18"
              text-anchor="end">
            ${shearB.toFixed(2)} kN
        </text>

        <text x="${startX}" y="245"
              fill="currentColor" font-size="18">A</text>

        <text x="${endX}" y="245"
              fill="currentColor" font-size="18"
              text-anchor="end">B</text>
    `;
}

function drawMomentDiagram(length, load) {
    const svg = document.getElementById("moment-svg");

    if (!svg) return;

    const startX = 100;
    const endX = 700;
    const centerY = 70;
    const diagramHeight = 140;
    const steps = 100;

    const maxMoment = Math.abs(
        calculateBendingMoment(length, load, length / 2)
    );

    const points = [];

    for (let i = 0; i <= steps; i++) {
        const x = length * i / steps;
        const moment = calculateBendingMoment(length, load, x);

        const svgX = startX + (endX - startX) * i / steps;

        const svgY = centerY + (
            maxMoment > 0
                ? moment / maxMoment * diagramHeight
                : 0
        );

        points.push(`${svgX},${svgY}`);
    }

    const polylinePoints = points.join(" ");

    const areaPoints =
        `${startX},${centerY} ` +
        polylinePoints +
        ` ${endX},${centerY}`;

    svg.innerHTML = `
        <line x1="${startX}" y1="${centerY}"
              x2="${endX}" y2="${centerY}"
              stroke="currentColor" stroke-width="1"/>

        <polygon points="${areaPoints}"
                 fill="#3c9b8f" fill-opacity="0.15"/>

        <polyline points="${polylinePoints}"
                  fill="none"
                  stroke="#3c9b8f"
                  stroke-width="3"/>

        <text x="400" y="235"
              text-anchor="middle"
              fill="currentColor" font-size="18">
              Mmax = ${calculateBendingMoment(length, load, length / 2).toFixed(2)} kN·m

        </text>

        <text x="${startX}" y="55"
              fill="currentColor" font-size="18">A</text>

        <text x="${endX}" y="55"
              text-anchor="end"
              fill="currentColor" font-size="18">B</text>
    `;
}

