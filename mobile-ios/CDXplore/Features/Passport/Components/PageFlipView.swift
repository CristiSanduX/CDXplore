//
//  PageFlipView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 21.12.2025.
//


//
//  PageFlipView.swift
//  CDXplore
//
//  Premium single-page flip (cover + pages)
//

import SwiftUI
import UIKit

struct PageFlipView: View {

    // MARK: - Model

    struct Page: Identifiable {
        let id = UUID()
        let content: AnyView
        var isCover: Bool = false

        init(isCover: Bool = false, _ content: AnyView) {
            self.isCover = isCover
            self.content = content
        }
    }

    let pages: [Page]
    @Binding var index: Int

    // MARK: - Gesture / animation state

    @GestureState private var dragX: CGFloat = 0
    @State private var animProgress: CGFloat = 0          // -1...1
    @State private var flipToken = UUID()                 // cancels previous async updates

    // UX
    private let edgeTapWidth: CGFloat = 70
    private let threshold: CGFloat = 0.23                 // how far you must swipe to complete

    var body: some View {
        GeometryReader { geo in
            let w = max(geo.size.width, 1)
            let h = max(geo.size.height, 1)

            // live progress: drag drives it, plus any running animation
            let raw = (dragX / w) + animProgress
            let progress = clamp(raw, -1, 1)
            let t = min(1, abs(progress))

            ZStack {
                // Under page (revealed during flip)
                if progress > 0, let next = page(at: index + 1) {
                    pageShell(next, in: geo.size)
                        .opacity(0.96)
                        .overlay(underShadow(t: t, dir: 1).opacity(0.9))
                } else if progress < 0, let prev = page(at: index - 1) {
                    pageShell(prev, in: geo.size)
                        .opacity(0.96)
                        .overlay(underShadow(t: t, dir: -1).opacity(0.9))
                }

                // Current page (flipping)
                if let current = page(at: index) {
                    pageShell(current, in: geo.size)
                        .modifier(PremiumFlip3D(progress: progress, isCover: current.isCover))
                }

                // Edge tap zones (tap to flip)
                HStack(spacing: 0) {
                    Color.clear
                        .contentShape(Rectangle())
                        .frame(width: edgeTapWidth, height: h)
                        .onTapGesture { flipPrev() }

                    Spacer(minLength: 0)

                    Color.clear
                        .contentShape(Rectangle())
                        .frame(width: edgeTapWidth, height: h)
                        .onTapGesture { flipNext() }
                }
            }
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 10, coordinateSpace: .local)
                    .updating($dragX) { value, state, _ in
                        state = value.translation.width
                    }
                    .onEnded { value in
                        finishDrag(value.translation.width / w)
                    }
            )
        }
    }

    // MARK: - Page shell

    private func pageShell(_ page: Page, in size: CGSize) -> some View {
        ZStack {
            // paper body
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.14), radius: 18, x: 0, y: 10)
                .overlay(
                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .stroke(Color.black.opacity(0.08), lineWidth: 1)
                )

            // subtle paper grain / wash so it feels like a document
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [
                            Color.black.opacity(0.02),
                            Color.clear,
                            Color.black.opacity(0.015)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .blendMode(.multiply)
                .allowsHitTesting(false)

            // content
            page.content
                .padding(16)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        }
        .frame(width: size.width, height: size.height)
        .clipped()
    }

    // MARK: - Actions

    private func flipNext() {
        guard index < pages.count - 1 else { return }
        startFlip(to: 1, then: index + 1)
    }

    private func flipPrev() {
        guard index > 0 else { return }
        startFlip(to: -1, then: index - 1)
    }

    private func startFlip(to direction: CGFloat, then nextIndex: Int) {
        flipToken = UUID()
        let token = flipToken

        // snap to direction fast (premium but responsive)
        animProgress = 0
        hapticStart(isCover: pages[safe: index]?.isCover ?? false)

        withAnimation(.spring(response: 0.62, dampingFraction: 0.88)) {
            animProgress = direction
        }

        // commit the index early so user can continue fast
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.20) {
            guard token == flipToken else { return }
            index = nextIndex
            hapticFinish()
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) {
                animProgress = 0
            }
        }
    }

    private func finishDrag(_ dxNormalized: CGFloat) {
        if dxNormalized < -threshold, index < pages.count - 1 {
            flipNext()
        } else if dxNormalized > threshold, index > 0 {
            flipPrev()
        } else {
            // snap back
            flipToken = UUID()
            withAnimation(.spring(response: 0.45, dampingFraction: 0.90)) {
                animProgress = 0
            }
        }
    }

    // MARK: - Helpers

    private func page(at i: Int) -> Page? {
        guard i >= 0 && i < pages.count else { return nil }
        return pages[i]
    }

    private func clamp(_ n: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat {
        max(a, min(b, n))
    }

    private func underShadow(t: CGFloat, dir: CGFloat) -> some View {
        let alpha = Double(0.18 * t)
        let x: CGFloat = dir > 0 ? -18 : 18

        return RoundedRectangle(cornerRadius: 26, style: .continuous)
            .fill(
                LinearGradient(
                    colors: [.black.opacity(alpha), .clear],
                    startPoint: dir > 0 ? .leading : .trailing,
                    endPoint: dir > 0 ? .trailing : .leading
                )
            )
            .blur(radius: 10)
            .offset(x: x)
            .allowsHitTesting(false)
    }


    // MARK: - Haptics

    private func hapticStart(isCover: Bool) {
        let gen = UIImpactFeedbackGenerator(style: isCover ? .soft : .light)
        gen.prepare()
        gen.impactOccurred(intensity: isCover ? 0.65 : 0.78)
    }

    private func hapticFinish() {
        let gen = UIImpactFeedbackGenerator(style: .rigid)
        gen.prepare()
        gen.impactOccurred(intensity: 0.88)
    }
}

// MARK: - Premium 3D flip modifier

private struct PremiumFlip3D: ViewModifier {
    let progress: CGFloat              // -1...1
    let isCover: Bool

    func body(content: Content) -> some View {
        let t = min(1, abs(progress))
        let sign: CGFloat = progress >= 0 ? 1 : -1

        // cover flips a touch heavier (more “book”)
        let maxAngle: Double = isCover ? 152 : 145
        let angle = Double(-progress) * maxAngle

        return content
            .overlay(depthShadow(t: t, sign: sign))
            .overlay(glare(t: t, sign: sign))
            .overlay(edgeShade(t: t, sign: sign))
            .overlay(backfaceDimming(t: t))
            .overlay(pageCurl(t: t, sign: sign))
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0), perspective: 0.78)
            .scaleEffect(1 - (isCover ? 0.020 : 0.024) * t)
            .opacity(Double(1 - 0.06 * t))
    }

    private func depthShadow(t: CGFloat, sign: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: 26, style: .continuous)
            .fill(Color.black.opacity(0.13 * (1 - abs(0.5 - Double(t)) * 2)))
            .blur(radius: 22)
            .offset(x: sign > 0 ? 28 : -28)
            .allowsHitTesting(false)
            .opacity(t > 0.01 ? 1 : 0)
    }

    private func glare(t: CGFloat, sign: CGFloat) -> some View {
        let alpha = Double(0.22 * t)
        let x = (sign * (36 + 130 * t))

        return RoundedRectangle(cornerRadius: 26, style: .continuous)
            .fill(
                LinearGradient(
                    colors: [
                        .clear,
                        .white.opacity(alpha),
                        .white.opacity(alpha * 0.30),
                        .clear
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .rotationEffect(.degrees(sign > 0 ? -18 : 18))
            .offset(x: x, y: -10)
            .blur(radius: 6)
            .blendMode(.screen)
            .allowsHitTesting(false)
            .opacity(t > 0.02 ? 1 : 0)
    }

    private func edgeShade(t: CGFloat, sign: CGFloat) -> some View {
        let alpha = Double(0.11 * t)
        return HStack(spacing: 0) {
            if sign < 0 { Spacer(minLength: 0) }
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color.black.opacity(alpha), .clear],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(width: 20)
            if sign > 0 { Spacer(minLength: 0) }
        }
        .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .allowsHitTesting(false)
        .opacity(t > 0.02 ? 1 : 0)
    }

    private func backfaceDimming(t: CGFloat) -> some View {
        let x = clamp01((t - 0.55) / 0.45)
        return RoundedRectangle(cornerRadius: 26, style: .continuous)
            .fill(Color.black.opacity(Double(0.18 * x)))
            .blendMode(.multiply)
            .allowsHitTesting(false)
            .opacity(t > 0.55 ? 1 : 0)
    }

    private func pageCurl(t: CGFloat, sign: CGFloat) -> some View {
        let curl = clamp01((t - 0.06) / 0.94)
        let width: CGFloat = 34 + 28 * curl
        let x = sign > 0 ? (22 + 20 * curl) : (-22 - 20 * curl)

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
                .blur(radius: 1.6)
                .offset(x: x)

            if sign > 0 { Spacer(minLength: 0) }
        }
        .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .blendMode(.screen)
        .allowsHitTesting(false)
        .opacity(curl > 0.01 ? 1 : 0)
    }

    private func clamp01(_ n: CGFloat) -> CGFloat { max(0, min(1, n)) }
}

// MARK: - Safe index helper

private extension Array {
    subscript(safe i: Int) -> Element? {
        guard i >= 0 && i < count else { return nil }
        return self[i]
    }
}
