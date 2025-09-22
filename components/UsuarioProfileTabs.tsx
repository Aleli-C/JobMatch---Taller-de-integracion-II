"use client";

import React, { useState } from "react";
import StarRating from "./StarRating";

type Review = { text: string; rating: number };

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<"publicaciones" | "completados" | "resenas">(
    "publicaciones"
  );
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handlePublishReview = () => {
    if (reviewText.trim() && selectedRating > 0) {
      setMyReview({ text: reviewText.trim(), rating: selectedRating });
      setReviewText("");
      setSelectedRating(0);
    }
  };

  const handleEditReview = () => {
    if (!myReview) return;
    setReviewText(myReview.text);
    setSelectedRating(myReview.rating);
    setMyReview(null);
  };

  const handleCancelReview = () => {
    setReviewText("");
    setSelectedRating(0);
  };

  const isEditing = myReview === null && reviewText !== "";

  return (
    <section className="flex-[2] bg-white p-8 rounded-lg shadow-md">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("publicaciones")}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === "publicaciones"
              ? "text-blue-500 border-blue-500"
              : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500"
          }`}
          type="button"
        >
          Publicaciones
        </button>
        <button
          onClick={() => setActiveTab("completados")}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === "completados"
              ? "text-blue-500 border-blue-500"
              : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500"
          }`}
          type="button"
        >
          Trabajos Completados
        </button>
        <button
          onClick={() => setActiveTab("resenas")}
          className={`font-bold border-b-2 px-4 py-2 transition ${
            activeTab === "resenas"
              ? "text-blue-500 border-blue-500"
              : "text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500"
          }`}
          type="button"
        >
          Reseñas
        </button>
      </div>

      <div className="tab-content-container">
        {/* ...contenido estático igual... */}
        {activeTab === "resenas" && (
          <div>
            {myReview ? (
              <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-4">
                <p className="text-sm font-bold text-blue-800">Tu Reseña</p>
                <p className="text-sm text-gray-700 italic mt-2">"{myReview.text}"</p>
                <StarRating rating={myReview.rating} />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleEditReview}
                    className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition duration-300"
                    type="button"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                <p className="text-sm font-semibold mb-2">Escribe tu reseña:</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-icon text-2xl cursor-pointer ${
                        star <= selectedRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setSelectedRating(star)}
                      role="button"
                      tabIndex={0}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full h-24 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Escribe tu reseña aquí..."
                  value={reviewText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelReview}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePublishReview}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
                    type="button"
                    disabled={!reviewText.trim() || selectedRating === 0}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            )}

            {/* Reseñas de ejemplo... conserva el resto tal cual */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileTabs;
