import React, { useEffect, useState } from "react";
import SelectField from "../utils/common/SelectField";
import { FormDataType } from "../pages/MockPaperCreatorPage";
import classData from "../data/classData.json";
interface Step2Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onNext: () => void;
}

const Step1Details: React.FC<Step2Props> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);

  useEffect(() => {
    if (formData.classLevel && classData[formData.classLevel]) {
      const subjects = classData[formData.classLevel].subjects;
      setAvailableSubjects(subjects);
      setFormData((prevData) => ({
        ...prevData,
        selectedSubjects: "",
        chapter: "",
      }));

      if (subjects.length > 0) {
        const firstSubject = subjects[0];

        const chapters =
          (
            classData[formData.classLevel]?.chapters as Record<string, string[]>
          )[firstSubject] || [];

        setAvailableChapters(chapters);
      }
    }
  }, [formData.classLevel, setFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.board) newErrors.board = "Board selection is required.";
    if (!formData.classLevel)
      newErrors.classLevel = "Class selection is required.";
    if (!formData.selectedSubjects || formData.selectedSubjects.length === 0) {
      newErrors.selectedSubjects = "At least one subject must be selected.";
    }
    if (!formData.chapter) newErrors.chapter = "Chapter selection is required.";
    if (!formData.paperType)
      newErrors.paperType = "Paper type selection is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      onNext();
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      selectedSubjects: selected,
    }));
    if (selected.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedSubjects: "",
      }));
    }

    if (selected.length > 0) {
      const firstSelectedSubject = selected;
      const classLevel = formData.classLevel as keyof typeof classData;

     const chapters =
        (classData[classLevel]?.chapters as Record<string, string[]>)[
          firstSelectedSubject
        ] || [];
      setAvailableChapters(chapters);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <SelectField
          label="Select Board"
          name="board"
          options={["CBSE"]}
          disabled
          value={formData.board}
          onChange={handleChange}
        />
        {errors.board && (
          <p className="text-red-500 text-sm mt-2">{errors.board}</p>
        )}
      </div>
      <div className="mb-4">
        <SelectField
          label="Select Class"
          name="classLevel"
          options={["Class 9th", "Class 10th", "Class 11th", "Class 12th"]}
          value={formData.classLevel}
          onChange={handleChange}
        />
        {errors.classLevel && (
          <p className="text-red-500 text-sm mt-2">{errors.classLevel}</p>
        )}
      </div>
      <div className="mb-4">
        <SelectField
          label="Select Subjects"
          name="subjects"
          options={availableSubjects}
          value={formData.selectedSubjects}
          onChange={handleSubjectChange}
        />
        {errors.selectedSubjects && (
          <p className="text-red-500 text-sm">{errors.selectedSubjects}</p>
        )}
      </div>
      <div className="mb-4">
        <SelectField
          label="Select Chapter"
          name="chapter"
          options={availableChapters}
          value={formData.chapter}
          onChange={handleChange}
        />
        {errors.chapter && (
          <p className="text-red-500 text-sm mt-2">{errors.chapter}</p>
        )}
      </div>
      <div className="mb-4">
        <SelectField
          label="Type of Paper"
          name="paperType"
          options={["Mock Paper", "Test Questions"]}
          value={formData.paperType}
          onChange={handleChange}
        />
        {errors.paperType && (
          <p className="text-red-500 text-sm mt-2">{errors.paperType}</p>
        )}
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Step1Details;
