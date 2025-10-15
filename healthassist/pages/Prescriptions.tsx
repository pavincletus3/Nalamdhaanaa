import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  extractPrescriptionDetailsFromImage,
  verifyPrescriptionWithAI,
} from "../services/geminiService";
import { Prescription as PrescriptionType, Alert, AlertType } from "../types";
import Spinner from "../components/Spinner";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const fileToBase64 = (
  file: File
): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(",")[0].split(":")[1].split(";")[0];
      const data = result.split(",")[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

const Prescription: React.FC<{ prescription: PrescriptionType }> = ({
  prescription,
}) => {
  const [showOcr, setShowOcr] = useState(false);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800">
          Prescription from {prescription.uploadedAt.toLocaleDateString()}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            prescription.status === "Verified"
              ? "bg-green-100 text-green-800"
              : prescription.status === "Pending Review"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {prescription.status}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {prescription.medicines.map((med) => (
          <div key={med.id} className="text-sm text-gray-600">
            <span className="font-semibold">
              {med.name} {med.dosage}
            </span>{" "}
            - {med.frequency} for {med.duration}
          </div>
        ))}
      </div>
      {prescription.ocrText && (
        <div className="mt-4">
          <button
            onClick={() => setShowOcr(!showOcr)}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {showOcr ? "Hide" : "Show"} Extracted Text
          </button>
          {showOcr && (
            <pre className="mt-2 p-3 bg-gray-50 rounded-md text-xs text-gray-600 whitespace-pre-wrap font-mono">
              {prescription.ocrText}
            </pre>
          )}
        </div>
      )}
      {prescription.warnings.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-800 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Warnings
          </h4>
          <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-red-700">
            {prescription.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Prescriptions: React.FC = () => {
  const { prescriptions, addPrescription, addAlerts } = useData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: upload, 1: processing, 2: results
  const [result, setResult] = useState<PrescriptionType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setStep(1);
    setErrorMessage(null);

    try {
      // Step 1: Convert image to base64
      const { mimeType, data: imageData } = await fileToBase64(selectedFile);

      // Step 2: Call Gemini to extract details
      const geminiResult = await extractPrescriptionDetailsFromImage(
        mimeType,
        imageData
      );

      // Step 3: Call Gemini to verify prescription for interactions and dosage
      const verificationResult = await verifyPrescriptionWithAI(
        geminiResult.medicines || []
      );

      const newAlerts: Alert[] = verificationResult.warnings.map(
        (warning, index) => ({
          id: `alert-presc-${Date.now()}-${index}`,
          type: AlertType.DrugInteraction, // General type for all prescription warnings
          message: warning,
          createdAt: new Date(),
          isRead: false,
        })
      );

      const newPrescription: PrescriptionType = {
        id: `p-${Date.now()}`,
        uploadedAt: new Date(),
        imageUrl: URL.createObjectURL(selectedFile),
        medicines: geminiResult.medicines || [],
        ocrText: geminiResult.rawText || "",
        warnings: verificationResult.warnings,
        status:
          verificationResult.warnings.length > 0
            ? "Pending Review"
            : "Verified",
      };

      addPrescription(newPrescription);
      if (newAlerts.length > 0) {
        addAlerts(newAlerts);
      }
      setResult(newPrescription);
      setStep(2);
    } catch (error: any) {
      console.error("Error processing prescription:", error);
      setErrorMessage(
        error.message || "An unknown error occurred. Please try again."
      );
      setStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setSelectedFile(null);
    setResult(null);
    setStep(0);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Prescription Verification
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
        {step === 0 && (
          <div
            className="relative z-10 upload-container"
            style={{ opacity: 1, visibility: "visible" }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upload a New Prescription
            </h2>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-center">
                <p className="text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              </div>
            )}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                />
              </label>
            </div>
            {selectedFile && (
              <p className="mt-4 text-center text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="mt-6 w-full bg-primary-500 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-primary-600 transition-colors relative z-10"
              style={{ opacity: 1, visibility: "visible" }}
            >
              Upload and Verify
            </button>
          </div>
        )}
        {step === 1 && (
          <div className="text-center py-12">
            <Spinner />
            <p className="mt-4 font-semibold text-gray-700">
              Analyzing your prescription...
            </p>
            <p className="text-gray-500">This may take a moment.</p>
          </div>
        )}
        {step === 2 && result && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Verification Complete
            </h2>
            <Prescription prescription={result} />
            <button
              onClick={resetFlow}
              className="mt-6 w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Upload Another
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your Prescriptions
        </h2>
        <div className="space-y-4">
          {prescriptions.length > 0 ? (
            prescriptions.map((p) => (
              <Prescription key={p.id} prescription={p} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2">
                You haven't uploaded any prescriptions yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
