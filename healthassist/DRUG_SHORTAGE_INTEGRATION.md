# Drug Shortage Alert Integration

This document describes the integration of drug shortage alert functionality from the studio-main project into the healthassist project.

## Features Integrated

### 1. Drug Shortage Predictor

- **Location**: Alerts page → Drug Shortage Alerts tab
- **Functionality**: Predicts potential drug shortages based on risk factors
- **Components**:
  - `DrugShortageChecker`: Main search interface with autocomplete
  - `ShortagePrediction`: Displays detailed shortage analysis
  - `RiskIndicator`: Visual risk level indicator
  - `AlternativesTable`: Shows alternative medications
  - `RecommendationsAccordion`: Actionable recommendations

### 2. UI Components Added

- `components/ui/table.tsx`: Table components for displaying alternatives
- `components/ui/badge.tsx`: Badge component for status indicators
- `components/ui/accordion.tsx`: Accordion for recommendations
- `components/ui/alert.tsx`: Alert components for warnings
- `components/ui/input.tsx`: Input component for search
- `components/ui/button.tsx`: Button component

### 3. Data & Services

- `lib/drugs.ts`: Drug database with shortage risk data
- `types/drug-shortage.ts`: TypeScript interfaces for drug shortage data
- `services/drug-shortage.ts`: Mock AI prediction service

### 4. Enhanced Alerts Page

- Added tabbed interface with three sections:
  - System Alerts (existing functionality)
  - Medication Reminders (existing functionality)
  - Drug Shortage Alerts (new functionality)

## How to Use

1. Navigate to the Alerts page in the healthassist application
2. Click on the "Drug Shortage Alerts" tab
3. Enter a drug name in the search field (autocomplete available)
4. Click "Check Shortage" to get predictions
5. Review the detailed analysis including:
   - Risk level and percentage
   - Days until potential shortage
   - Alternative medications with pricing
   - Risk factors
   - Actionable recommendations

## Available Drugs for Testing

The system includes data for these medications:

- Paracetamol 500mg
- Amoxicillin 500mg (High risk)
- Metformin 500mg
- Azithromycin 500mg (High risk)
- Amlodipine 5mg
- Ibuprofen 400mg
- Atorvastatin 20mg
- Omeprazole 20mg

## Technical Implementation

The integration maintains the existing healthassist architecture while adding new components that are compatible with the existing styling and patterns. The mock AI service simulates real-world drug shortage predictions based on risk factors and historical data.

## Future Enhancements

- Integration with real AI/ML models for predictions
- Real-time data from pharmaceutical supply chains
- User-specific medication tracking and alerts
- Integration with pharmacy inventory systems
