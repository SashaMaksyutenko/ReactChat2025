import { useEffect } from "react";
import PropTypes from 'prop-types';
import { useRef } from "react";
import Dropzone from "dropzone";
import { UploadSimple } from "@phosphor-icons/react";
export default function FileDropZone({
  acceptedFiles = "image/*,video/*",
  maxFileSize = 16 * 1024 * 1024,
  url = "/file/post",
  multiple,
  onFilesSelected
}) {
  const dropzoneRef = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    Dropzone.autoDiscover = false;
    if (!dropzoneRef.current && formRef.current) {
      dropzoneRef.current = new Dropzone(formRef.current, {
        url,
        acceptedFiles,
        maxFileSize: maxFileSize / (1024 * 1024), // Dropzone expects the max file size in MB
        autoProcessQueue: false,
        addRemoveLink: true,
        uploadMultiple: multiple,
        maxFiles: multiple ? 8 : 1,
    })
    }
    dropzoneRef.current.on("addedfile", () => {
      if (onFilesSelected) {
        onFilesSelected(dropzoneRef.current.files);
      }
    });
    dropzoneRef.current.on("maxfilesexceeded", (file) => {
      dropzoneRef.current.removeFile(file); // This will remove the excess file from the Dropzone
    });
    return () => {
      if (dropzoneRef.current) {
        dropzoneRef.current.removeAllFiles(true); // Clear all selected files
        dropzoneRef.current.destroy();
        dropzoneRef.current = null;
      }
    };
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6.5">
        <form
          action={url}
          ref={formRef}
    id="upload"
  >
          <div className="dz-message">
            <div className="mb-2.5 flex justify-center flex-col items-center space-y-2">
              <div className="shadow-10 flex h-15 w-15 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white">
                <UploadSimple size={24} />
              </div>
              <span className="font-medium text-black dark:text-white">
                {multiple ? 'Drop files here to upload' : 'Drop File to upload'}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
FileDropZone.propTypes = {
  acceptedFiles: PropTypes.string,
  maxFileSize: PropTypes.number,
  url: PropTypes.string,
  multiple: PropTypes.bool,
  onFilesSelected: PropTypes.func,
};
