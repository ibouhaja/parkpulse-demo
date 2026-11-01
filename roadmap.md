# Anmeldung, Präferenzen und Rewards-Pop-up
- [x] Apple und Gastzugang ergänzen; bestehende E-Mail-/Google-Anmeldung und Bestätigung erhalten. LinkedIn nicht unterstützt; keine Referenzbilder angehängt.
- [x] Fahrzeugpräferenzen bei Registrierung und im Profil speichern und kontogetrennt auf Kartenfilter anwenden.
- [x] Persönliches Rewards-Pop-up ergänzt; 184 Tests bestanden. Angemeldetes Profil: EV + Wallbox/Familie + Maße gespeichert und nach Neuladen als Filter aktiv, Popup mit 698 Punkten, Abmeldung und Gastreset ohne Laufzeitfehler geprüft. Apple/Google konfiguriert; vollständiger OAuth-Durchlauf und E-Mail-Bestätigungslink nicht geprüft. Registrierung mit example.com wurde korrekt abgewiesen; erfolgreiche neue Registrierung bleibt wegen fehlender erreichbarer Test-Mailadresse unbestätigt.

# Tarife und ParkPulse-Punkte
- [x] Unterschiedliche Tarife, Tageslimit, Abend-/Shopping-/Erststundenangebote konsistent berechnen; Altbestände und eingefrorene Gebühren erhalten.
- [x] Separate Punkte, Vorschau, sichere Gutschrift und idempotente Einlösung mit Verlauf ergänzen; ältere dokumentierte Boni bleiben unverändert und nicht rückwirkend einlösbar.
- [x] Karte, Details, Reservierung, Checkout und Prämien aktualisieren; 172 Tests bestanden. Angemeldet: fehlgeschlagene Zahlung, 1.698 Punkte nach Visa-Demo-Erfolg, 1.000 Punkte gegen 1-€-Gutschein, 698 Punkte nach Neuladen und nach zukünftiger Gutscheinzahlung; Reservierungspreis 2,48 € in Cloud geprüft. 390px ohne Überlauf; keine Laufzeitfehler.

# Karten-App und Demo-Reservierung
- [x] Karten-Startseite, kombinierte Filter und ausziehbare Parkhausdetails; 390px ohne Überlauf und mit sichtbarer Reservierungsschaltfläche.
- [x] Sichere Reservierung, Termin, Preisvorschau, Stornierung und simulierter Ankunft; angemeldet bis Visa-Demo-Beleg und Neuladen geprüft.
- [x] Reservierte Kapazität über gemeinsamen Plan geschützt; Replay erzeugt keine zweite Buchung und anderer Buchungsversuch auf denselben Platz wird abgewiesen.
- [x] Bonuspunkte ohne doppelte Stempel; 148 Tests bestanden, fehlgeschlagene Zahlung und erfolgreicher Abschluss mit 100 Punkten im Konto geprüft.
- [x] Nach vorhandener Markenidentität gestaltet; drei erwähnte Referenz-Screenshots waren nicht angehängt.

# 3D-Parkhausplan
- [x] Architektur, fotografische Betonmaterialien, nähere Kamera, Fahreransicht und sanften Stellplatzfokus umgesetzt.
- [x] Drei externe CC0-Fahrzeuge (Three-door hatchback, Car-derived small van, Large three-row SUV) integriert und Quellen dokumentiert. Limousine bleibt eigenes Modell: hochwertiges CC0-Modell nicht verifiziert; kein Fotorealismus zugesichert.
- [x] Zuerst P1, danach P2/P3, Fahreransicht, Wallbox-Klickauswahl und P3/B02 nach Reload geprüft; 390px ohne Überlauf oder Laufzeitfehler. 126 Tests bestanden; echte GPU-Geschwindigkeit und physische Touchbedienung nicht messbar.
- [x] Vier eigene detailliertere GLB-Fahrzeuge mit gerundeten Karosserien, getrennten Lack-/Glas-/Radmaterialien, Spiegeln und Lampen ergänzt; kein verifiziertes realistisches CC0-Komplettset verfügbar.
- [x] Parkflächen, Wallboxkabel und Beleuchtung verbessert; P1/P2/P3, Klickauswahl, Einparken und P3/B10 nach Reload geprüft, 390px ohne Überlauf oder Laufzeitfehler; 124 Tests bestanden. Fotorealismus und echte Gerätegeschwindigkeit nicht zugesichert.
- [x] P1 mit lizenzierten Fahrzeugen, Kamera und gemeinsamer Auswahl implementieren und prüfen.
- [x] P2/P3 und dreigeschossige Gesamtansicht ergänzt; 3D-Klickauswahl, Einparken und Kontospeicherung P3/B02 nach Neuladen geprüft.
- [x] Desktop und 390px-Smartphone-Darstellung geprüft, keine Laufzeitfehler oder horizontales Überlaufen; 123 Tests bestanden. Echte Gerätegeschwindigkeit und physische Touchbedienung bleiben hardwareabhängig.

# Accounts
- [x] Sign-up, sign-in, sign-out, password reset, Google, profiles.
- [x] Per-user parking data with server-side rules; one-time import of browser data.
- [x] Simulated PayPal option.
- [x] Fix registration error messages (weak/leaked password etc.) and verify flow.

# Stellplatzübersicht
- [x] Wallbox-Filter für alle Ebenen und Kombinationen korrigiert; 114 Tests bestanden und P3/B02 in aktiver Session gespeichert sowie nach Neuladen bestätigt.
- [x] Mehr Plätze, ausgewogene Ausgangsbelegung, Kennzahlen und Schutz aktueller Sessionpositionen.
- [x] 84 Tests bestanden; Vorschau und veröffentlichte Version verglichen, Kontodaten gelesen und Speicherung geprüft; Veröffentlichungsschritte erklärt.
- [x] Fahrzeugfilter, Bedürfnisse, Kategorien und fiktive Stellplatzeigenschaften ergänzen.
- [x] Ungeklärte Belegung und ungeeignete Plätze sperren; Alternativen und Tests ergänzen (80 Tests bestanden; Filter, Ladeleistung, LKW-Auswahl, Simulation und schmale Ansicht im Browser geprüft).
- [x] Grafische Demo-Pläne für alle sechs Parkhäuser mit P1/P2/P3 und gesperrten belegten Plätzen.
- [x] Manuelle und automatische Belegungssimulation, Erklärung und Speichern in der aktiven Session.
- [x] 72 automatisierte Tests bestanden; Auswahl, beide Simulationen, sechs Pläne und schmale Ansicht im Browser geprüft.
- [x] Vorhandene aktive Session im Browser geprüft: P1/B03 gespeichert, nach drei Simulationen und Neuladen weiterhin gespeichert und belegt; keine Zahlung oder Abschluss ausgelöst.
