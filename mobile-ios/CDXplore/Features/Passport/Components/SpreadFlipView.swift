//
//  SpreadFlipView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 17.12.2025.
//


import SwiftUI

/// Two-page spread flip (book-like).
/// - Tap left/right edges OR drag to flip spreads
/// - Shows a "spine" in the middle for premium look
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
    @State private var animProgress: CGFloat = 0   // -1...1
    @State private var isAnimating = false

    private let edgeTapWidth: CGFloat = 70
    private let threshold: CGFloat = 0.25

    var body: some View {
        GeometryReader { geo in
            let w = max(geo.size.width, 1)
            let progress = clamp((dragX / w) + animProgress, -1, 1)

            ZStack {
                // Under spread (revealed during flip)
                if progress > 0, let next = spread(at: index + 1) {
                    SpreadContainer(spread: next, size: geo.size)
                        .opacity(0.95)
                } else if progress < 0, let prev = spread(at: index - 1) {
                    SpreadContainer(spread: prev, size: geo.size)
                        .opacity(0.95)
                }

                // Current spread (flips)
                if let current = spread(at: index) {
                    SpreadContainer(spread: current, size: geo.size)
                        .modifier(SpreadFlip3D(progress: progress))
                        .allowsHitTesting(!isAnimating)
                }

                // Edge tap zones
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
                    .updating($dragX) { value, state, _ in
                        state = value.translation.width
                    }
                    .onEnded { value in
                        finishDrag(value.translation.width / w)
                    }
            )
        }
        .frame(height: 560)
        .padding(.horizontal, 14)
    }

    // MARK: - Container

    private struct SpreadContainer: View {
        let spread: Spread
        let size: CGSize

        var body: some View {
            ZStack {
                // paper base
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.14), radius: 18, x: 0, y: 10)

                if spread.isCover {
                    // Cover uses full width (single)
                    spread.left
                        .padding(18)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    HStack(spacing: 0) {
                        spread.left
                            .padding(18)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)

                        // Spine
                        Rectangle()
                            .fill(Color.black.opacity(0.06))
                            .frame(width: 1)
                            .overlay(
                                Rectangle()
                                    .fill(Color.black.opacity(0.03))
                                    .frame(width: 10)
                                    .blur(radius: 6)
                            )

                        spread.right
                            .padding(18)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                }
            }
        }
    }

    // MARK: - Actions

    private func flipNext() {
        guard !isAnimating else { return }
        guard index < spreads.count - 1 else { return }

        isAnimating = true
        withAnimation(.spring(response: 0.62, dampingFraction: 0.88)) {
            animProgress = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.42) {
            index += 1
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) {
                animProgress = 0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) { isAnimating = false }
        }
    }

    private func flipPrev() {
        guard !isAnimating else { return }
        guard index > 0 else { return }

        isAnimating = true
        withAnimation(.spring(response: 0.62, dampingFraction: 0.88)) {
            animProgress = -1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.42) {
            index -= 1
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) {
                animProgress = 0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) { isAnimating = false }
        }
    }

    private func finishDrag(_ dxNormalized: CGFloat) {
        guard !isAnimating else { return }

        // drag left => next (negative), drag right => prev (positive)
        if dxNormalized < -threshold, index < spreads.count - 1 {
            flipNext()
        } else if dxNormalized > threshold, index > 0 {
            flipPrev()
        } else {
            // snap back
            isAnimating = true
            withAnimation(.spring(response: 0.45, dampingFraction: 0.9)) {
                animProgress = 0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) { isAnimating = false }
        }
    }

    private func spread(at i: Int) -> Spread? {
        guard i >= 0 && i < spreads.count else { return nil }
        return spreads[i]
    }

    private func clamp(_ n: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat {
        max(a, min(b, n))
    }
}

// MARK: - 3D modifier

private struct SpreadFlip3D: ViewModifier {
    let progress: CGFloat // -1...1

    func body(content: Content) -> some View {
        let t = min(1, abs(progress))
        let angle = Double(-progress) * 140 // premium, not harsh 180

        return content
            .overlay(
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(
                        Color.black.opacity(
                            0.10 * (1 - abs(0.5 - Double(t)) * 2)
                        )
                    )
                    .blur(radius: 18)
                    .offset(x: progress >= 0 ? 24 : -24)
                    .allowsHitTesting(false)
            )
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0), perspective: 0.75)
            .scaleEffect(1 - (0.025 * t))
            .opacity(Double(1 - 0.06 * t))
    }
}
