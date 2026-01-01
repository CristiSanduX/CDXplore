//
//  PassportCoverView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct PassportCoverView: View {
    var title: String = "CDXPLORE"
    var subtitle: String = "TRAVEL PASSPORT"
    var passportNo: String = "CDX-000127"

    @State private var tilt: CGSize = .zero
    @State private var isPressed = false
    @State private var shimmerPhase: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            let size = geo.size
            let w = max(size.width, 1)
            let h = max(size.height, 1)

            ZStack {
                Color.clear

                ZStack {
                    leatherBase(size: size)
                        .overlay(embossStitch(size: size).blendMode(.overlay).opacity(0.75))
                        .overlay(foilFrame(size: size).blendMode(.screen).opacity(0.9))
                        .overlay(nfcChip(size: size).opacity(0.92))
                        .overlay(coverContent(size: size))
                        .overlay(foilShimmer(size: size).blendMode(.screen).opacity(0.55))
                        .overlay(vignette(size: size).opacity(0.55))
                        .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))

                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .strokeBorder(Color.white.opacity(0.14), lineWidth: 1)
                        .overlay(
                            RoundedRectangle(cornerRadius: 26, style: .continuous)
                                .strokeBorder(Color.black.opacity(0.35), lineWidth: 1)
                                .blur(radius: 0.4)
                                .offset(y: 1)
                                .mask(RoundedRectangle(cornerRadius: 26, style: .continuous))
                        )
                }
                // ✅ FULLSCREEN: ia exact mărimea primită (nu mai “micșora” singur la 420/620)
                .frame(width: w, height: h)
                .shadow(color: .black.opacity(isPressed ? 0.25 : 0.34),
                        radius: isPressed ? 18 : 26,
                        x: 0, y: isPressed ? 10 : 18)
                .scaleEffect(isPressed ? 0.985 : 1)
                .rotation3DEffect(.degrees(Double(tilt.width) * 0.06), axis: (x: 0, y: 1, z: 0))
                .rotation3DEffect(.degrees(Double(-tilt.height) * 0.05), axis: (x: 1, y: 0, z: 0))
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isPressed)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: tilt)
                .contentShape(Rectangle())
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { v in
                            isPressed = true
                            let dx = v.location.x - size.width / 2
                            let dy = v.location.y - size.height / 2
                            tilt = .init(width: dx, height: dy)
                        }
                        .onEnded { _ in
                            isPressed = false
                            tilt = .zero
                        }
                )
                .onAppear {
                    withAnimation(.linear(duration: 2.8).repeatForever(autoreverses: false)) {
                        shimmerPhase = 1
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: - Layers

    private func leatherBase(size: CGSize) -> some View {
        let burgundy1 = Color(red: 0.38, green: 0.08, blue: 0.18)
        let burgundy2 = Color(red: 0.55, green: 0.10, blue: 0.22)
        let deep = Color.black.opacity(0.85)

        return ZStack {
            LinearGradient(
                colors: [deep, burgundy1, burgundy2, deep],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            RadialGradient(
                colors: [
                    Color.white.opacity(0.16),
                    Color.white.opacity(0.02),
                    Color.clear
                ],
                center: .topLeading,
                startRadius: 20,
                endRadius: 340
            )
            .blendMode(.screen)

            Canvas { ctx, sz in
                let count = 900
                for i in 0..<count {
                    var rng = SeededRandom(seed: UInt64(i * 9973 + 17))
                    let x = CGFloat(rng.nextDouble()) * sz.width
                    let y = CGFloat(rng.nextDouble()) * sz.height
                    let r = CGFloat(0.4 + rng.nextDouble() * 0.9)
                    let a = CGFloat(0.02 + rng.nextDouble() * 0.03)
                    let rect = CGRect(x: x, y: y, width: r, height: r)
                    ctx.fill(Path(ellipseIn: rect), with: .color(.white.opacity(Double(a))))
                }
            }
            .blendMode(.overlay)
            .opacity(0.55)
        }
    }

    private func embossStitch(size: CGSize) -> some View {
        let inset: CGFloat = 18
        let corner: CGFloat = 22
        return RoundedRectangle(cornerRadius: corner, style: .continuous)
            .inset(by: inset)
            .stroke(style: StrokeStyle(lineWidth: 1.2, lineCap: .round, dash: [1.2, 6]))
            .foregroundStyle(Color.white.opacity(0.12))
            .shadow(color: .black.opacity(0.55), radius: 1.2, x: 0, y: 1)
    }

    private func foilFrame(size: CGSize) -> some View {
        let gold1 = Color(red: 0.98, green: 0.88, blue: 0.52)
        let gold2 = Color(red: 0.85, green: 0.70, blue: 0.34)

        return RoundedRectangle(cornerRadius: 24, style: .continuous)
            .inset(by: 12)
            .stroke(
                LinearGradient(
                    colors: [gold2.opacity(0.6), gold1.opacity(0.9), gold2.opacity(0.7)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ),
                lineWidth: 1.4
            )
            .shadow(color: .white.opacity(0.18), radius: 6, x: 0, y: 0)
    }

    private func nfcChip(size: CGSize) -> some View {
        let chipW: CGFloat = 86
        let chipH: CGFloat = 62
        let gold = LinearGradient(
            colors: [
                Color(red: 0.95, green: 0.86, blue: 0.55).opacity(0.9),
                Color(red: 0.78, green: 0.63, blue: 0.28).opacity(0.9)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // ✅ scale position with size instead of clamping to 300/220
        let x = size.width * 0.70
        let y = size.height * 0.33

        return ZStack {
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(gold)
                .shadow(color: .black.opacity(0.25), radius: 10, x: 0, y: 8)
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(Color.white.opacity(0.25), lineWidth: 1)
                )

            Path { p in
                p.move(to: CGPoint(x: 14, y: chipH * 0.35))
                p.addLine(to: CGPoint(x: chipW - 14, y: chipH * 0.35))
                p.move(to: CGPoint(x: 14, y: chipH * 0.65))
                p.addLine(to: CGPoint(x: chipW - 14, y: chipH * 0.65))
                p.move(to: CGPoint(x: chipW * 0.5, y: 10))
                p.addLine(to: CGPoint(x: chipW * 0.5, y: chipH - 10))
            }
            .stroke(Color.black.opacity(0.18), style: StrokeStyle(lineWidth: 2, lineCap: .round))
        }
        .frame(width: chipW, height: chipH)
        .position(x: x, y: y)
        .opacity(0.9)
    }

    private func coverContent(size: CGSize) -> some View {
        let gold = Color(red: 0.93, green: 0.83, blue: 0.50)

        // ✅ make typography scale slightly with height (keeps it premium on small phones & big pages)
        let titleSize = max(28, min(40, size.height * 0.06))
        let globeSize = max(38, min(54, size.height * 0.075))

        return VStack(spacing: 12) {
            Spacer(minLength: 18)

            Text(subtitle)
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .tracking(2.2)
                .foregroundStyle(gold.opacity(0.86))

            Text(title)
                .font(.system(size: titleSize, weight: .heavy, design: .rounded))
                .tracking(1.2)
                .foregroundStyle(gold)
                .shadow(color: .black.opacity(0.35), radius: 10, x: 0, y: 10)

            ZStack {
                Circle()
                    .fill(Color.white.opacity(0.06))
                    .overlay(Circle().stroke(gold.opacity(0.35), lineWidth: 1))
                    .frame(width: 110, height: 110)

                Image(systemName: "globe.europe.africa.fill")
                    .font(.system(size: globeSize, weight: .bold))
                    .foregroundStyle(gold.opacity(0.92))
            }
            .padding(.top, 6)

            Spacer()

            VStack(spacing: 6) {
                Text("PASSPORT No.")
                    .font(.system(size: 11, weight: .semibold, design: .rounded))
                    .tracking(1.8)
                    .foregroundStyle(gold.opacity(0.75))

                Text(passportNo)
                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                    .tracking(1.2)
                    .foregroundStyle(gold.opacity(0.92))
            }
            .padding(.bottom, 20)
        }
        .padding(.horizontal, 22)
        .padding(.vertical, 18)
    }

    private func foilShimmer(size: CGSize) -> some View {
        // ✅ use actual container size
        let w = max(size.width, 1)
        let h = max(size.height, 1)

        let phase = shimmerPhase
        let x = (-w * 0.9) + (w * 1.8) * phase

        return Rectangle()
            .fill(
                LinearGradient(
                    colors: [
                        Color.clear,
                        Color.white.opacity(0.18),
                        Color.white.opacity(0.04),
                        Color.clear
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .frame(width: w * 0.55, height: h * 1.4)
            .rotationEffect(.degrees(18))
            .offset(x: x, y: -h * 0.15)
            .blur(radius: 6)
            .mask(
                RoundedRectangle(cornerRadius: 26, style: .continuous)
                    .frame(width: w, height: h)
            )
    }

    private func vignette(size: CGSize) -> some View {
        RadialGradient(
            colors: [
                Color.clear,
                Color.black.opacity(0.10),
                Color.black.opacity(0.38)
            ],
            center: .center,
            startRadius: 90,
            endRadius: 430
        )
    }
}

private struct SeededRandom {
    private var state: UInt64
    init(seed: UInt64) { state = seed == 0 ? 0x12345678 : seed }
    mutating func next() -> UInt64 {
        state &+= 0x9E3779B97F4A7C15
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58476D1CE4E5B9
        z = (z ^ (z >> 27)) &* 0x94D049BB133111EB
        return z ^ (z >> 31)
    }
    mutating func nextDouble() -> Double {
        Double(next() & 0x1FFFFFFFFFFFFF) / Double(0x1FFFFFFFFFFFFF)
    }
}

