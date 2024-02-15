import ModelForm from "@/components/ModelForm";
import React from "react";
import modelOptions from "@/data/options";
function AddListing() {
  return (
    <div>
      <ModelForm modelOptions={modelOptions} />
    </div>
  );
}

export default AddListing;
