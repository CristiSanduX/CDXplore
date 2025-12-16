//
//  VisitedStore.swift
//  CDXplore
//
//  Created by Cristi Sandu on 16.12.2025.
//


import Foundation
import Combine
import FirebaseAuth
import FirebaseFirestore

@MainActor
final class VisitedStore: ObservableObject {

    @Published private(set) var visited: Set<String> = []

    private var listener: ListenerRegistration?

    func start() {
        stop()

        guard let uid = Auth.auth().currentUser?.uid else {
            visited = []
            return
        }

        let ref = Firestore.firestore()
            .collection("users").document(uid)
            .collection("meta").document("visited")

        listener = ref.addSnapshotListener { [weak self] snap, _ in
            guard let self else { return }
            let arr = (snap?.data()?["visited"] as? [String]) ?? []
            self.visited = Set(arr)
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
    }

    func toggle(_ code: String) {
        guard let uid = Auth.auth().currentUser?.uid else { return }

        if visited.contains(code) { visited.remove(code) } else { visited.insert(code) }

        let ref = Firestore.firestore()
            .collection("users").document(uid)
            .collection("meta").document("visited")

        ref.setData(["visited": Array(visited).sorted()], merge: true)
    }
}
