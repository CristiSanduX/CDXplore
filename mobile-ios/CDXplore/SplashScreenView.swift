//
//  SplashScreenView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct SplashScreenView: View {

    @Binding var isPresented: Bool

    @State private var scale: CGFloat = 0.8
    @State private var opacityLogo: Double = 0
    @State private var containerOpacity: Double = 1

    @State private var orbitDeg: Double = 0
    @State private var orbitOpacity: Double = 0

    @State private var useBurgundy = true

    private let burgundy = Color(red: 0.48, green: 0.12, blue: 0.23)
    private let ink = Color.black

    private var activeColor: Color { useBurgundy ? burgundy : ink }
    private var secondaryColor: Color { useBurgundy ? ink : burgundy }

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()

            VStack(spacing: 14) {

                ZStack {
                    ZStack {
                        Circle()
                            .trim(from: 0.06, to: 0.26)
                            .stroke(
                                activeColor.opacity(0.82),
                                style: StrokeStyle(lineWidth: 8, lineCap: .round, lineJoin: .round)
                            )
                            .shadow(color: activeColor.opacity(0.22), radius: 10)
                            .rotationEffect(.degrees(orbitDeg))
                            .frame(width: 270, height: 270)
                            .blendMode(.plusLighter)
                            .opacity(orbitOpacity)

                        Circle()
                            .trim(from: 0.32, to: 0.38)
                            .stroke(
                                secondaryColor.opacity(0.55),
                                style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round)
                            )
                            .shadow(color: secondaryColor.opacity(0.12), radius: 8)
                            .rotationEffect(.degrees(orbitDeg + 10))
                            .frame(width: 270, height: 270)
                            .blendMode(.multiply)
                            .opacity(orbitOpacity * 0.85)

                        Circle()
                            .trim(from: 0.54, to: 0.66)
                            .stroke(
                                activeColor.opacity(0.20),
                                style: StrokeStyle(lineWidth: 18, lineCap: .round, lineJoin: .round)
                            )
                            .blur(radius: 8)
                            .rotationEffect(.degrees(orbitDeg + 18))
                            .frame(width: 296, height: 296)
                            .blendMode(.plusLighter)
                            .opacity(orbitOpacity * 0.95)
                    }
                    .rotation3DEffect(.degrees(62), axis: (x: 1, y: 0, z: 0))
                    .rotationEffect(.degrees(-28))
                    .scaleEffect(x: 1.05, y: 0.90)
                    .allowsHitTesting(false)

                    Image("logo1")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 240, height: 240)
                        .opacity(opacityLogo)
                }

                Text("CDXPLORE")
                    .font(.system(size: 34, weight: .black, design: .monospaced))
                    .tracking(3.5)
                    .foregroundStyle(activeColor)
                    .animation(.easeInOut(duration: 0.35), value: useBurgundy)
                    .opacity(opacityLogo)
            }
            .scaleEffect(scale)
        }
        .opacity(containerOpacity)
        .onAppear {
            startAnimation()
        }
    }

    private func startAnimation() {

        withAnimation(.easeInOut(duration: 1.4)) {
            scale = 1
            opacityLogo = 1
            orbitOpacity = 1
        }

        withAnimation(.linear(duration: 1.15).repeatForever(autoreverses: false)) {
            orbitDeg = 360
        }

        let colorStart = 1.6
        let colorStep = 0.45
        let switches = 4

        for i in 0..<switches {
            DispatchQueue.main.asyncAfter(deadline: .now() + colorStart + Double(i) * colorStep) {
                withAnimation(.easeInOut(duration: 0.35)) {
                    useBurgundy.toggle()
                }
            }
        }

        // exit
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.6) {
            withAnimation(.easeIn(duration: 0.18)) {
                orbitOpacity = 0
            }

            DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
                withAnimation(.easeIn(duration: 0.35)) {
                    scale = 45
                    containerOpacity = 0
                }

                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    isPresented = false
                }
            }
        }
    }
}

#Preview {
    SplashScreenView(isPresented: .constant(true))
}
