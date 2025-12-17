//
//  StampView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct StampView: View {
    let country: Country

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                Text(flagEmoji(country.code))
                    .font(.system(size: 16))

                Text(country.name)
                    .font(.system(size: 13, weight: .black))
                    .lineLimit(1)

                Spacer()

                Text(country.continent)
                    .font(.system(size: 10, weight: .bold, design: .rounded))
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            ZStack {
                // stamp wash
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.black.opacity(0.03))
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06), lineWidth: 1))

                // circular stamp
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .overlay(Circle().stroke(Color.black.opacity(0.14), lineWidth: 2))

                    Circle()
                        .stroke(style: StrokeStyle(lineWidth: 2, lineCap: .round, dash: [4, 5]))
                        .foregroundStyle(Color.black.opacity(0.22))
                        .padding(10)

                    // landmark
                    Text(landmarkEmoji(for: country.code))
                        .font(.system(size: 40))
                        .shadow(color: .black.opacity(0.10), radius: 8, x: 0, y: 4)

                    // bottom mini code
                    Text(country.code.uppercased())
                        .font(.system(size: 10, weight: .black, design: .monospaced))
                        .foregroundStyle(Color.black.opacity(0.45))
                        .padding(.top, 64)
                }
                .frame(width: 92, height: 92)
                .rotationEffect(.degrees(rotation(for: country.code)))
                .opacity(0.98)

                // small flag coin
                VStack {
                    HStack {
                        Spacer()
                        ZStack {
                            Circle().fill(Color.white)
                            Circle().stroke(Color.black.opacity(0.12), lineWidth: 1)
                            Text(flagEmoji(country.code)).font(.system(size: 14))
                        }
                        .frame(width: 28, height: 28)
                    }
                    Spacer()
                }
                .padding(10)
            }
            .frame(height: 120)
        }
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 20, style: .continuous).fill(Color.white))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.black.opacity(0.06), lineWidth: 1))
        .shadow(color: .black.opacity(0.06), radius: 14, x: 0, y: 8)
    }

    // MARK: - Helpers

    private func rotation(for code: String) -> Double {
        // deterministic small rotation per country for “real stamp” feel
        let h = abs(code.uppercased().hashValue)
        let v = (h % 9) - 4 // -4...+4
        return Double(v)
    }

    private func landmarkEmoji(for code: String) -> String {
        switch code.uppercased() {
        case "FR": return "🗼"
        case "US": return "🗽"
        case "GB": return "🎡"
        case "IT": return "🏛️"
        case "ES": return "💃"
        case "DE": return "🏰"
        case "JP": return "⛩️"
        case "CN": return "🏯"
        case "KR": return "🏯"
        case "GR": return "🏛️"
        case "EG": return "🛕"
        case "TR": return "🕌"
        case "AE": return "🏙️"
        case "BR": return "⛪️"
        case "AR": return "🏔️"
        case "CA": return "🍁"
        case "AU": return "🦘"
        case "NZ": return "🌿"
        case "RO": return "🏰"
        default: return "🌍"
        }
    }

    private func flagEmoji(_ countryCode: String) -> String {
        // Converts ISO country code to regional indicator flag
        let code = countryCode.uppercased()
        guard code.count == 2 else { return "🏳️" }
        let scalars = code.unicodeScalars.compactMap { scalar -> UnicodeScalar? in
            guard let v = UnicodeScalar(127397 + Int(scalar.value)) else { return nil }
            return v
        }
        return String(String.UnicodeScalarView(scalars))
    }
}
