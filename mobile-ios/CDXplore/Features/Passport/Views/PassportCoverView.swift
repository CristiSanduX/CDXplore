//
//  PassportCoverView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import SwiftUI

struct PassportCoverView: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color(red: 0.48, green: 0.12, blue: 0.23))

            VStack(spacing: 10) {
                Image(systemName: "globe.europe.africa")
                    .font(.system(size: 42))
                    .foregroundStyle(.white)

                Text("PASSPORT")
                    .font(.system(size: 20, weight: .black))
                    .tracking(3)
                    .foregroundStyle(.white)

                Text("CDXPLORE")
                    .font(.system(size: 12, weight: .semibold))
                    .tracking(2)
                    .foregroundStyle(.white.opacity(0.8))
            }
        }
        .frame(height: 200)
        .shadow(radius: 12)
    }
}
