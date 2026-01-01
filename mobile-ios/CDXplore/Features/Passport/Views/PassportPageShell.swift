//
//  PassportPageShell.swift
//  CDXplore
//
//  Created by Cristi Sandu on 17.12.2025.
//

import SwiftUI

struct PassportPageShell<Content: View>: View {
    let title: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(title)
                .font(.system(size: 18, weight: .black))
                .tracking(0.4)

            content
        }
        // keep the page pinned to top, without pushing content down/up unexpectedly
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}
