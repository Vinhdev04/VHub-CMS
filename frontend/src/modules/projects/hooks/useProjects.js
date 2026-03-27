import { useEffect, useState } from "react";
import { getProjects } from "../services/projects.service";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProjects()
      .then((data) => {
        if (mounted) {
          setProjects(data);
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

  return { projects, loading };
}
