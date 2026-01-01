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
    @Published private(set) var visitedDates: [String: Date] = [:]

    private var listener: ListenerRegistration?
    private var didBackfillThisSession = false



    func start() {
        stop()
        didBackfillThisSession = false

        guard let uid = Auth.auth().currentUser?.uid else {
            visited = []
            visitedDates = [:]
            return
        }

        let ref = Firestore.firestore()
            .collection("users").document(uid)
            .collection("meta").document("visited")

        listener = ref.addSnapshotListener { [weak self] snap, err in
            guard let self else { return }
            if let err { print("VisitedStore listener error:", err.localizedDescription) }

            let data = snap?.data() ?? [:]

            // 1) visited array
            let arr = (data["visited"] as? [String]) ?? []
            let set = Set(arr.map { $0.uppercased() })

            // 2) visitedDates map
            var map: [String: Date] = [:]
            if let raw = data["visitedDates"] as? [String: Timestamp] {
                for (k, ts) in raw {
                    map[k.uppercased()] = ts.dateValue()
                }
            } else if let rawAny = data["visitedDates"] as? [String: Any] {
                for (k, v) in rawAny {
                    if let ts = v as? Timestamp {
                        map[k.uppercased()] = ts.dateValue()
                    } else if let d = v as? Date {
                        map[k.uppercased()] = d
                    }
                }
            }

            self.visited = set
            self.visitedDates = map

            // Backfill once per start() to avoid repeated writes on every snapshot.
            self.maybeBackfillMissingDatesOnce(uid: uid, ref: ref, visitedSet: set, dates: map)
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
    }

    func toggle(_ code: String) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        let c = code.uppercased()

        let ref = Firestore.firestore()
            .collection("users").document(uid)
            .collection("meta").document("visited")

        // optimistic UI
        if visited.contains(c) {
            visited.remove(c)
            visitedDates.removeValue(forKey: c)
            removeRemote(code: c, ref: ref)
        } else {
            visited.insert(c)
            if visitedDates[c] == nil { visitedDates[c] = Date() }
            addRemote(code: c, date: visitedDates[c] ?? Date(), ref: ref)
        }
    }

    // MARK: - Remote writes (atomic + race-safe)

    private func addRemote(code c: String, date: Date, ref: DocumentReference) {
        let payload: [String: Any] = [
            "visited": FieldValue.arrayUnion([c]),
            "visitedDates.\(c)": Timestamp(date: date)
        ]

        ref.updateData(payload) { err in
            // If doc doesn't exist yet, create it.
            if let err = err as NSError?, err.domain == FirestoreErrorDomain, err.code == FirestoreErrorCode.notFound.rawValue {
                ref.setData(
                    [
                        "visited": [c],
                        "visitedDates": [c: Timestamp(date: date)]
                    ],
                    merge: true
                )
            }
        }
    }

    private func removeRemote(code c: String, ref: DocumentReference) {
        let payload: [String: Any] = [
            "visited": FieldValue.arrayRemove([c]),
            "visitedDates.\(c)": FieldValue.delete()
        ]

        ref.updateData(payload) { err in
            // If doc doesn't exist, nothing to do.
            if let err { print("VisitedStore removeRemote error:", err.localizedDescription) }
        }
    }

    // MARK: - Backfill

    private func maybeBackfillMissingDatesOnce(
        uid: String,
        ref: DocumentReference,
        visitedSet: Set<String>,
        dates: [String: Date]
    ) {
        guard !didBackfillThisSession else { return }

        let missing = visitedSet.filter { dates[$0] == nil }
        guard !missing.isEmpty else { return }

        didBackfillThisSession = true

        let now = Date()
        var updates: [String: Any] = [:]
        for c in missing {
            updates["visitedDates.\(c)"] = Timestamp(date: now)
        }

        // optimistic local merge (so UI shows dates immediately)
        var next = dates
        for c in missing { next[c] = now }
        self.visitedDates = next

        ref.updateData(updates) { err in
            if let err { print("VisitedStore backfill error:", err.localizedDescription) }
        }
    }
}
