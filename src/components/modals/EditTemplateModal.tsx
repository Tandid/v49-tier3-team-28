import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

interface EditTemplateModalProps {
  open: boolean;
  onClose: () => void;
  templateData: ExerciseActivity[] | null;
  templateNameData: string | null;
  onUpdateTemplate: (updatedTemplateData: any) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  open,
  onClose,
  templateData,
  templateNameData,
  onUpdateTemplate,
}) => {
  // --------------------State --------------------

  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);

  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);

  const [toggleSearchBar, setToggleSearchBar] = useState<boolean>(false);

  const exercisesArray = Object.values(ExercisesDictionary);

  useEffect(() => {
    if (templateData) {
      setSelectedExercises(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (templateNameData) {
      setTemplateName(templateNameData);
    }
  }, [templateData]);

  useEffect(() => {
    if (searchInput) {
      const results = exercisesArray.filter((exercise) =>
        exercise.label.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  // ----------------------------------------------------------------

  const handleSelectExercise = (exercise: Exercise): ExerciseActivity => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit: "lbs" }],
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchInput("");
    setSearchResults([]);

    return newExercise;
  };

  const handleDeleteExercise = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(index, 1);
    setSelectedExercises(newSelectedExercises);
  };

  // ----------------------------------------------------------------

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        <h2 className="text-2xl font-bold">Edit Template</h2>
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FiX />
        </button>
        {/* Template Name */}
        <div className="w-full">
          <h1 className="text-xl mb-2">Template Name</h1>
          <input
            type="text"
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter a name for your template"
            className="border rounded-xl p-2 bg-gray-50 w-full text-center"
          />

          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Search Bar */}
        {toggleSearchBar ? (
          <div className="relative flex flex-col w-full">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for an exercise to add"
                className="border rounded-xl pl-10 pr-10 p-2 w-full bg-gray-50"
              />
              {searchInput && (
                <FiX
                  className="absolute right-3 cursor-pointer"
                  onClick={() => setSearchInput("")}
                />
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10 overflow-y-auto max-h-48">
                {searchResults.map((exercise: Exercise) => (
                  <div
                    key={exercise.id}
                    onClick={() => handleSelectExercise(exercise)}
                    className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white"
                  >
                    {exercise.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              className="flex text-green-500 justify-center w-full text-center"
              onClick={() => setToggleSearchBar(true)}
            >
              <FiPlus />
              <p>Add Exercise</p>
            </button>
          </div>
        )}

        <table className="min-w-full">
          <thead>
            <tr className="text-white text-center bg-orange-500">
              <th className="p-left-2">Exercise Name</th>
              <th className="p-left-2"># of Sets</th>
              <th className="p-left-2"></th>
            </tr>
          </thead>
          {selectedExercises.map((exercise, eIdx) => (
            <tbody className="overflow-y-auto">
              <td className="p-1">{exercise.exerciseName}</td>
              <td className="p-1 text-center">
                <input
                  type="text"
                  value={exercise.sets.length}
                  className="mb-2 mt-2 p-1 border rounded-xl w-1/2 text-center"
                  placeholder="1"
                />
              </td>
              <td>
                <button
                  className="p-right-2"
                  onClick={() => handleDeleteExercise(eIdx)}
                >
                  <FiX />
                </button>
              </td>
            </tbody>
          ))}
        </table>

        <div className="flex justify-end">
          <BasicRoundedButton
            label="Save"
            onClick={() => {}}
            className="ml-2"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditTemplateModal;
