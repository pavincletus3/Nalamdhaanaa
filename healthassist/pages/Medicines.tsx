import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { MedicineStock } from "../types";
import { Plus, Edit, Trash2 } from "lucide-react";

const MedicineForm: React.FC<{
  onSubmit: (medicine: Omit<MedicineStock, "id">) => void;
  onCancel: () => void;
  initialData?: MedicineStock;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || 0);
  const [dailyUsage, setDailyUsage] = useState(initialData?.dailyUsage || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate || quantity < 0 || dailyUsage < 0) {
      // Basic validation
      return;
    }
    onSubmit({ name, expiryDate, quantity, dailyUsage });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Medicine Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expiry Date
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity / Stock
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Daily Usage (Optional)
        </label>
        <input
          type="number"
          value={dailyUsage}
          onChange={(e) => setDailyUsage(Number(e.target.value))}
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600"
        >
          {initialData ? "Update" : "Add"} Medicine
        </button>
      </div>
    </form>
  );
};

const Medicines: React.FC = () => {
  const {
    medicineStocks,
    addMedicineStock,
    updateMedicineStock,
    deleteMedicineStock,
  } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<
    MedicineStock | undefined
  >(undefined);

  const handleAddSubmit = (medicine: Omit<MedicineStock, "id">) => {
    addMedicineStock({ ...medicine, id: `ms-${Date.now()}` });
    setShowForm(false);
  };

  const handleEditSubmit = (medicine: Omit<MedicineStock, "id">) => {
    if (editingMedicine) {
      updateMedicineStock({ ...medicine, id: editingMedicine.id });
    }
    setEditingMedicine(undefined);
    setShowForm(false);
  };

  const handleEdit = (medicine: MedicineStock) => {
    setEditingMedicine(medicine);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMedicine(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Medicines</h1>
        <button
          onClick={() => {
            setEditingMedicine(undefined);
            setShowForm(true);
          }}
          className="flex items-center bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medicine
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingMedicine ? "Edit" : "Add New"} Medicine
          </h2>
          <MedicineForm
            onSubmit={editingMedicine ? handleEditSubmit : handleAddSubmit}
            onCancel={handleCancel}
            initialData={editingMedicine}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden wide-card mx-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Expiry Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Daily Usage
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicineStocks.map((med) => (
              <tr key={med.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {med.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(med.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {med.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {med.dailyUsage > 0 ? med.dailyUsage : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(med)}
                    className="text-primary hover:text-primary-700 p-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteMedicineStock(med.id)}
                    className="text-danger hover:text-red-700 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {medicineStocks.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No medicines added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Medicines;
