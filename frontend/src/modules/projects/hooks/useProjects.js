import { useEffect, useState } from "react";
import { getProjects } from "../services/projects.service";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getProjects()
      .then((data) => {
        if (mounted) {
          setProjects(data);
          setError("");
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Đã có lỗi khi tải danh sách dự án.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { projects, loading, error };
}
