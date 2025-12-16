//
//  PageFlipView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 17.12.2025.
//


import SwiftUI

struct PageFlipView: View {
    let pages: [AnyView]
    @Binding var index: Int

    // gesture
    @GestureState private var dragX: CGFloat = 0
    @State private var animProgress: CGFloat = 0
    @State private var isAnimating = false

    private let edgeTapWidth: CGFloat = 70
    private let threshold: CGFloat = 0.28

    var body: some View {
        GeometryReader { geo in
            let w = max(geo.size.width, 1)
            let progress = clamp((dragX / w) + animProgress, -1, 1)

            ZStack {
                // Background "paper" so it feels like a book, not floating cards
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.12), radius: 18, x: 0, y: 10)

                // Under page (revealed during flip)
                if progress > 0, let next = page(at: index + 1) {
                    next
                        .padding(18)
                        .opacity(0.92)
                } else if progress < 0, let prev = page(at: index - 1) {
                    prev
                        .padding(18)
                        .opacity(0.92)
                }

                // Current page (the one that flips)
                if let current = page(at: index) {
                    current
                        .padding(18)
                        .modifier(Flip3D(progress: progress))
                        .allowsHitTesting(!isAnimating) // prevent spam inputs mid animation
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
                DragGesture(minimumDistance: 10, coordinateSpace: .local)
                    .updating($dragX) { value, state, _ in
                        state = value.translation.width
                    }
                    .onEnded { value in
                        finishDrag(value.translation.width / w)
                    }
            )
        }
        .frame(height: 560) // poți schimba după gust
        .padding(.horizontal, 14)
    }

    // MARK: - Actions

    private func flipNext() {
        guard !isAnimating else { return }
        guard index < pages.count - 1 else { return }

        isAnimating = true
        withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
            animProgress = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.40) {
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
        withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
            animProgress = -1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.40) {
            index -= 1
            withAnimation(.spring(response: 0.45, dampingFraction: 0.95)) {
                animProgress = 0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) { isAnimating = false }
        }
    }

    private func finishDrag(_ dxNormalized: CGFloat) {
        guard !isAnimating else { return }

        // drag left => next (negative translation), drag right => prev (positive translation)
        if dxNormalized < -threshold, index < pages.count - 1 {
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

    private func page(at i: Int) -> AnyView? {
        guard i >= 0 && i < pages.count else { return nil }
        return pages[i]
    }

    private func clamp(_ n: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat {
        max(a, min(b, n))
    }
}

// MARK: - 3D flip modifier

private struct Flip3D: ViewModifier {
    let progress: CGFloat // -1...1

    func body(content: Content) -> some View {
        // progress > 0 => flipping to next (rotate left)
        // progress < 0 => flipping to prev (rotate right)
        let angle = Double(-progress) * 150 // 0..150 degrees (keeps it premium, not full 180 harsh)

        return content
            .overlay(
                // subtle shadow during flip
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.black.opacity(shadowOpacity))
                    .blur(radius: 18)
                    .offset(x: shadowOffsetX, y: 0)
                    .allowsHitTesting(false)
            )
            .rotation3DEffect(
                .degrees(angle),
                axis: (x: 0, y: 1, z: 0),
                perspective: 0.7
            )
            .scaleEffect(scale)
            .opacity(opacity)
    }

    private var t: CGFloat { min(1, abs(progress)) }

    private var shadowOpacity: Double {
        // peak around mid-flip
        Double(0.10 * (1 - abs(0.5 - t) * 2))
    }

    private var shadowOffsetX: CGFloat {
        // shadow goes opposite direction of flip
        progress >= 0 ? 22 : -22
    }

    private var scale: CGFloat {
        1 - (0.03 * t)
    }

    private var opacity: Double {
        // keep readable
        Double(1 - 0.08 * t)
    }
}
