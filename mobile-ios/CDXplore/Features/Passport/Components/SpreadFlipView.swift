//
//  SpreadFlipView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 17.12.2025.
//

import SwiftUI
import UIKit

struct SpreadFlipView: View {
    struct Spread: Identifiable {
        let id = UUID()
        let left: AnyView
        let right: AnyView
        let isCover: Bool
    }

    let spreads: [Spread]
    @Binding var index: Int

    @GestureState private var dragX: CGFloat = 0
    @State private var animProgress: CGFloat = 0
    @State private var flipToken = UUID()

    private let edgeTapWidth: CGFloat = 70
    private let threshold: CGFloat = 0.25

    var body: some View {
        GeometryReader { geo in
            let w = max(geo.size.width, 1)
            let progress = clamp((dragX / w) + animProgress, -1, 1)

            ZStack {
                if progress > 0, let next = spread(at: index + 1) {
                    SpreadContainer(spread: next, flipProgress: 0, size: geo.size)
                        .opacity(0.98)
                } else if progress < 0, let prev = spread(at: index - 1) {
                    SpreadContainer(spread: prev, flipProgress: 0, size: geo.size)
                        .opacity(0.98)
                }

                if let current = spread(at: index) {
                    SpreadContainer(spread: current, flipProgress: progress, size: geo.size)
                        .modifier(SpreadFlip3D(progress: progress))
                }

                HStack(spacing: 0) {
                    Color.clear
                        .contentShape(Rectangle())
                        .frame(width: edgeTapWidth)
                        .onTapGesture { flipPrev() }

                    Spacer(minLength: 0)

                    Color.clear
                        .contentShape(Rectangle())
                        .frame(width: edgeTapWidth)
                        .onTapGesture { flipNext() }
                }
            }
            .gesture(
                DragGesture(minimumDistance: 10)
                    .updating($dragX) { value, state, _ in state = value.translation.width }
                    .onEnded { value in finishDrag(value.translation.width / w) }
            )
        }
    }

    // MARK: - Container (hard-sized + clipped)

    private struct SpreadContainer: View {
        let spread: Spread
        let flipProgress: CGFloat
        let size: CGSize

        var body: some View {
            let t = min(1, abs(flipProgress))
            let sign: CGFloat = flipProgress >= 0 ? 1 : -1

            ZStack {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.14), radius: 18, x: 0, y: 10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .stroke(Color.black.opacity(0.06), lineWidth: 1)
                    )

                if !spread.isCover {
                    spineGlow(t: t, sign: sign)
                }

                if spread.isCover {
                    spread.left
                        .padding(18)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                        .clipped()
                } else {
                    HStack(spacing: 0) {
                        spread.left
                            .padding(18)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                            .clipped()

                        ZStack {
                            Rectangle().fill(Color.black.opacity(0.06)).frame(width: 1)
                            Rectangle().fill(Color.black.opacity(0.03)).frame(width: 10).blur(radius: 6)
                        }
                        .offset(x: -sign * (2.0 * t))

                        spread.right
                            .padding(18)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                            .clipped()
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                }
            }
            // ✅ hard lock size (this is the fix)
            .frame(width: size.width, height: size.height)
            .clipped()
        }

        private func spineGlow(t: CGFloat, sign: CGFloat) -> some View {
            let a = Double(0.10 * t)
            let x = -sign * (10 + 20 * t)

            return Rectangle()
                .fill(
                    LinearGradient(
                        colors: [.clear, .white.opacity(a), .clear],
                        startPoint: .leading, endPoint: .trailing
                    )
                )
                .frame(width: 140)
                .blur(radius: 10)
                .offset(x: x)
                .mask(RoundedRectangle(cornerRadius: 22, style: .continuous))
                .allowsHitTesting(false)
        }
    }

    // MARK: - Actions

    private func flipNext() {
        guard index < spreads.count - 1 else { return }
        flipToken = UUID()
        let token = flipToken

        animProgress = 0
        hapticStart()

        withAnimation(.spring(response: 0.62, dampingFraction: 0.88)) { animProgress = 1 }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
            guard token == flipToken else { return }
            index += 1
            hapticFinish()
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) { animProgress = 0 }
        }
    }

    private func flipPrev() {
        guard index > 0 else { return }
        flipToken = UUID()
        let token = flipToken

        animProgress = 0
        hapticStart()

        withAnimation(.spring(response: 0.62, dampingFraction: 0.88)) { animProgress = -1 }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
            guard token == flipToken else { return }
            index -= 1
            hapticFinish()
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) { animProgress = 0 }
        }
    }

    private func finishDrag(_ dxNormalized: CGFloat) {
        if dxNormalized < -threshold, index < spreads.count - 1 {
            flipNext()
        } else if dxNormalized > threshold, index > 0 {
            flipPrev()
        } else {
            flipToken = UUID()
            withAnimation(.spring(response: 0.45, dampingFraction: 0.9)) { animProgress = 0 }
        }
    }

    private func spread(at i: Int) -> Spread? {
        guard i >= 0 && i < spreads.count else { return nil }
        return spreads[i]
    }

    private func clamp(_ n: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat { max(a, min(b, n)) }

    // MARK: - Haptics

    private func hapticStart() {
        let isCover = spreads.indices.contains(index) ? spreads[index].isCover : false
        let gen = UIImpactFeedbackGenerator(style: isCover ? .soft : .light)
        gen.prepare()
        gen.impactOccurred(intensity: isCover ? 0.65 : 0.75)
    }

    private func hapticFinish() {
        let gen = UIImpactFeedbackGenerator(style: .rigid)
        gen.prepare()
        gen.impactOccurred(intensity: 0.85)
    }
}

// MARK: - 3D modifier (same as before, keep your premium look)

private struct SpreadFlip3D: ViewModifier {
    let progress: CGFloat

    func body(content: Content) -> some View {
        let t = min(1, abs(progress))
        let angle = Double(-progress) * 140
        let sign: CGFloat = progress >= 0 ? 1 : -1

        return content
            .overlay(depthShadow(t: t, sign: sign))
            .overlay(glare(t: t, sign: sign))
            .overlay(edgeShade(t: t, sign: sign))
            .overlay(backfaceDimming(t: t))
            .overlay(pageCurl(t: t, sign: sign))
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0), perspective: 0.75)
            .scaleEffect(1 - (0.025 * t))
            .opacity(Double(1 - 0.06 * t))
    }

    private func depthShadow(t: CGFloat, sign: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: 22, style: .continuous)
            .fill(Color.black.opacity(0.12 * (1 - abs(0.5 - Double(t)) * 2)))
            .blur(radius: 22)
            .offset(x: sign > 0 ? 26 : -26)
            .allowsHitTesting(false)
    }

    private func glare(t: CGFloat, sign: CGFloat) -> some View {
        let alpha = Double(0.22 * t)
        let x = (sign * (40 + 120 * t))

        return RoundedRectangle(cornerRadius: 22, style: .continuous)
            .fill(
                LinearGradient(
                    colors: [.clear, .white.opacity(alpha), .white.opacity(alpha * 0.35), .clear],
                    startPoint: .top, endPoint: .bottom
                )
            )
            .rotationEffect(.degrees(sign > 0 ? -18 : 18))
            .offset(x: x, y: -8)
            .blur(radius: 6)
            .blendMode(.screen)
            .allowsHitTesting(false)
            .opacity(t > 0.02 ? 1 : 0)
    }

    private func edgeShade(t: CGFloat, sign: CGFloat) -> some View {
        let alpha = Double(0.10 * t)
        return HStack(spacing: 0) {
            if sign < 0 { Spacer(minLength: 0) }
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color.black.opacity(alpha), .clear],
                        startPoint: .leading, endPoint: .trailing
                    )
                )
                .frame(width: 18)
            if sign > 0 { Spacer(minLength: 0) }
        }
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .allowsHitTesting(false)
        .opacity(t > 0.02 ? 1 : 0)
    }

    private func backfaceDimming(t: CGFloat) -> some View {
        let x = clamp01((t - 0.55) / 0.45)
        return RoundedRectangle(cornerRadius: 22, style: .continuous)
            .fill(Color.black.opacity(Double(0.18 * x)))
            .blendMode(.multiply)
            .allowsHitTesting(false)
            .opacity(t > 0.55 ? 1 : 0)
    }

    private func pageCurl(t: CGFloat, sign: CGFloat) -> some View {
        let curl = clamp01((t - 0.08) / 0.92)
        let width: CGFloat = 34 + 26 * curl
        let x = sign > 0 ? (22 + 18 * curl) : (-22 - 18 * curl)

        return HStack(spacing: 0) {
            if sign < 0 { Spacer(minLength: 0) }

            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(Double(0.55 * curl)),
                            Color.white.opacity(Double(0.12 * curl)),
                            Color.clear
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(width: width)
                .blur(radius: 1.5)
                .offset(x: x)

            if sign > 0 { Spacer(minLength: 0) }
        }
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .blendMode(.screen)
        .allowsHitTesting(false)
        .opacity(curl > 0.01 ? 1 : 0)
    }

    private func clamp01(_ n: CGFloat) -> CGFloat { max(0, min(1, n)) }
}
