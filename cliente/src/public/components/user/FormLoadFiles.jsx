import { useRef, useState } from "react";
import style from "./style.module.css";
import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";
import { useMutation, useQueryClient } from "react-query";

import { toast } from "sonner";

function FileUploadForm() {
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (
      selectedFile.type !== "image/png" &&
      selectedFile.type !== "image/jpg" &&
      selectedFile.type !== "image/jpeg"
    ) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    if (selectedFile.size > 4000000) {
      setError("El archivo es demasiado grande");
      return;
    }

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Activa el clic en el input oculto
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !fileType) {
      setError("Por favor, selecciona un archivo y un tipo");
      return;
    }

    // Crear un nuevo archivo con un nombre ajustado (opcional)
    const renamedFile = new File([file], `${fileType}`, {
      type: file.type,
    });

    // Crear FormData para enviar
    const formData = new FormData();
    formData.append("archivo", renamedFile);

    // Enviar archivo
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      setError("Error al subir el archivo");
      return;
    }
  };

  const mutation = useMutation({
    mutationKey: [""],
    mutationFn: UserFetch.updateFile,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Archivo Cargado correctamente");
        //resetear estados
        setFile(null);
        setFileType(null);
        setError(null);
        setPreview(null);
        queryClient.invalidateQueries("user");
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column align-items-center"
    >
      <select
        name="fileType"
        id="fileType"
        className="form-select mb-3"
        defaultValue={fileType}
        onChange={(e) => setFileType(e.target.value)}
      >
        <option value="null">--Tipo de archivo--</option>
        <option value="fichaMedica">FichaMedica</option>
        <option value="fotoDocumento">Documento</option>
        <option value="certificadoHongos">CertificadoPyM</option>
        <option value="foto">Foto de Perfil</option>
      </select>

      <div
        className={`d-flex flex-column align-items-center justify-content-center text-center p-5 border border-2 border-dashed rounded-3 ${style.dropzone}`}
        onClick={handleDropzoneClick} // Evento click para abrir el input
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
        <h4 className="mt-3">Carga tus archivos aquí</h4>
        {/* Input oculto */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }} // Ocultamos el input
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="alert alert-danger text-danger mt-3">{error}</div>
      )}

      {preview && !mutation.isLoading && (
        <div className="mt-3">
          <h5>Vista previa:</h5>
          <img
            src={preview}
            alt="Vista previa"
            className="img-fluid"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {mutation.isLoading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Subiendo Archivo...</span>
          </div>
        </div>
      ) : null}

      <button
        className="btn btn-primary mt-3"
        type="submit"
        disabled={mutation.isLoading}
      >
        Subir Archivo
      </button>
    </form>
  );
}

export default FileUploadForm;
