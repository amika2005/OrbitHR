import { OrgNode, BulkUploadData } from "@/types/org-chart-types";

/**
 * Calculate the number of direct reports for each node in the tree
 */
export function calculateDirectReports(node: OrgNode): OrgNode {
  if (!node.children || node.children.length === 0) {
    return { ...node, directReports: 0 };
  }

  const updatedChildren = node.children.map(calculateDirectReports);
  return {
    ...node,
    children: updatedChildren,
    directReports: updatedChildren.length,
  };
}

/**
 * Build a tree structure from flat employee data
 */
export function buildTreeFromFlatData(data: BulkUploadData[]): OrgNode | null {
  if (data.length === 0) return null;

  // Create a map of email to employee
  const employeeMap = new Map<string, OrgNode>();
  
  data.forEach((emp) => {
    employeeMap.set(emp.email, {
      id: emp.email,
      name: emp.name,
      role: emp.role,
      email: emp.email,
      department: emp.department,
      avatar: emp.avatar,
      children: [],
    });
  });

  // Find root (employee with no manager) and build hierarchy
  let root: OrgNode | null = null;
  
  data.forEach((emp) => {
    const employee = employeeMap.get(emp.email)!;
    
    if (!emp.managerEmail) {
      // This is the root
      root = employee;
    } else {
      // Add as child to manager
      const manager = employeeMap.get(emp.managerEmail);
      if (manager) {
        if (!manager.children) {
          manager.children = [];
        }
        manager.children.push(employee);
      }
    }
  });

  // Calculate direct reports
  if (root) {
    root = calculateDirectReports(root);
  }

  return root;
}

/**
 * Flatten tree to array
 */
export function flattenTree(node: OrgNode): OrgNode[] {
  const result: OrgNode[] = [node];
  
  if (node.children) {
    node.children.forEach((child) => {
      result.push(...flattenTree(child));
    });
  }
  
  return result;
}

/**
 * Find node by ID in tree
 */
export function findNodeById(node: OrgNode, id: string): OrgNode | null {
  if (node.id === id) return node;
  
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Validate that there are no circular references in the hierarchy
 */
export function validateHierarchy(data: BulkUploadData[]): { valid: boolean; error?: string } {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(email: string, managerMap: Map<string, string>): boolean {
    visited.add(email);
    recursionStack.add(email);

    const managerEmail = managerMap.get(email);
    if (managerEmail) {
      if (!visited.has(managerEmail)) {
        if (hasCycle(managerEmail, managerMap)) {
          return true;
        }
      } else if (recursionStack.has(managerEmail)) {
        return true;
      }
    }

    recursionStack.delete(email);
    return false;
  }

  // Build manager map
  const managerMap = new Map<string, string>();
  data.forEach((emp) => {
    if (emp.managerEmail) {
      managerMap.set(emp.email, emp.managerEmail);
    }
  });

  // Check for cycles
  for (const emp of data) {
    if (!visited.has(emp.email)) {
      if (hasCycle(emp.email, managerMap)) {
        return { valid: false, error: "Circular reference detected in hierarchy" };
      }
    }
  }

  // Check for multiple roots
  const roots = data.filter((emp) => !emp.managerEmail);
  if (roots.length === 0) {
    return { valid: false, error: "No root employee found (employee with no manager)" };
  }
  if (roots.length > 1) {
    return { valid: false, error: "Multiple root employees found. There should be only one CEO/top-level employee" };
  }

  return { valid: true };
}

/**
 * Get initials from name for avatar
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
