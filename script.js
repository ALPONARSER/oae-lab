
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
