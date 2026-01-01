//
//  PassportStampsView.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//

import SwiftUI

struct PassportStampsView: View {
    let countries: [Country]

    // only one expanded at a time (premium)
    @State private var expandedCode: String? = nil

    /// Change this to 4 if you want 4 rows visible per page
    private let rowsPerPage: Int = 3

    // spacing tuned for “bigger stamps” look
    private let colSpacing: CGFloat = 16
    private let rowSpacing: CGFloat = 16

    var body: some View {
        GeometryReader { geo in
            // Inner paddings: keep this in sync with your page shell padding if any
            let horizontalPadding: CGFloat = 0
            let availableWidth = max(0, geo.size.width - horizontalPadding * 2)

            // 2 columns always
            let cellWidth = (availableWidth - colSpacing) / 2
            let cellSize = floor(cellWidth)

            // How tall the scroll area should be to show exactly rowsPerPage rows
            let visibleHeight =
                (cellSize * CGFloat(rowsPerPage)) +
                (rowSpacing * CGFloat(max(0, rowsPerPage - 1))) +
                2 // small breathing room

            VStack(alignment: .leading, spacing: 12) {
                Text("Stamps")
                    .font(.system(size: 18, weight: .bold))

                ScrollView(showsIndicators: false) {
                    LazyVGrid(columns: columns, spacing: rowSpacing) {
                        ForEach(countries) { country in
                            StampView(
                                country: country,
                                visitedAt: nil,
                                expandedCode: $expandedCode
                            )
                            // ✅ make each stamp bigger + consistent sizing
                            .frame(width: cellSize, height: cellSize)
                        }
                    }
                    .padding(.vertical, 2)
                }
                // ✅ viewport shows 3 (or 4) rows like a “page”
                .frame(height: visibleHeight)
            }
            .frame(width: geo.size.width, height: geo.size.height, alignment: .topLeading)
        }
    }

    private var columns: [GridItem] {
        [
            GridItem(.flexible(), spacing: colSpacing),
            GridItem(.flexible(), spacing: colSpacing)
        ]
    }
}
